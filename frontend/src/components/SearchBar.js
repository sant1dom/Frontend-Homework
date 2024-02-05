import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import {Link} from 'react-router-dom';
import {GoSearch} from "react-icons/go";
import api from "../utils/api";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;


const SearchBar = ({placeholder = 'Search...', setShowMobileMenu}) => {
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const SearchResultMovie = ({result}) => (
        <Link to={`/movie/${result.id}`} key={result.id}>
            <div
                className="flex items-center p-2 hover:bg-gray-200 cursor-pointer transition ease-in-out duration-150 border z-50 rounded-md"
                onClick={() => {
                    results.length = 0;
                    setShowMobileMenu(false);
                }}
            >
                <img
                    src={result.poster || 'https://via.placeholder.com/50'}
                    alt=""
                    width="50"
                    height="50"
                    className="mr-2"
                />
                <span>{result.title}</span>
            </div>
        </Link>
    );

    const SearchResultList = ({result}) => (
        <Link to={`/list/${result.id}`} key={result.id}>
            <div
                className="flex items-center p-2 hover:bg-gray-200 cursor-pointer transition ease-in-out duration-150 border z-50"
                onClick={() => {
                    results.length = 0;
                    setShowMobileMenu(false);
                }}
            >
                <span>{result.name}</span>
            </div>
        </Link>
    );

    const NoResults = () => (
        <div className="flex items-center p-2 border">
            <span>No results</span>
        </div>
    );


    const SearchResults = ({results, noResults, error}) => {
        const movieResults = results.filter((result) => result.poster);
        const listResults = results.filter((result) => !result.poster);
        return (
            <div className="absolute z-50 bg-white w-full mt-1">
                {movieResults.length > 0 && (
                    <div className="flex flex-col">
                        <div className="px-4 py-2 border-b">
                            <span className="text-gray-800 font-bold">Movies</span>
                        </div>
                        {movieResults.map((result) => (
                            <SearchResultMovie result={result} key={result.id}/>
                        ))}
                    </div>
                )}

                {listResults.length > 0 && (
                    <div className="flex flex-col">
                        <div className="px-4 py-2 border-b">
                            <span className="text-gray-800 font-bold">Lists</span>
                        </div>
                        {listResults.map((result) => (
                            <SearchResultList result={result} key={result.id}/>
                        ))}
                    </div>
                )}

                {noResults && <NoResults/>}
            </div>
        );
    }

    const fetchMovieData = async (movieId) => {
        const response = await axios.get(`https://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movieId}`);
        return response.data.Poster;
    };

    const handleSearch = useCallback(
        debounce(async (term) => {
            setSearchTerm(term);
            if (term.length < 3) {
                setResults([]);
                setNoResults(false);
                return;
            }

            let movieResults = [];
            let listResults = [];

            try {
                const response = await api.get(`/movies/search?title=${term}`);
                if (response.data && response.data.length !== 0) {
                    response.data = response.data.slice(0, 3);
                    try {
                        await Promise.all(response.data.map(async (movie) => {
                            movie.poster = await fetchMovieData(movie.imdb_url.split('/')[4]);
                            return movie;
                        }));
                    } catch (error) {
                        console.error("Errore durante il recupero delle immagini: " + error);
                        response.data.map((movie) => {
                            movie.poster = 'https://via.placeholder.com/50';
                        });
                        //console.error("Errore durante il recupero delle immagini: " + error)
                    }
                    movieResults = response.data;
                }
            } catch (error) {
                //console.error("Errore durante la ricerca dei film: " + error);
            }

            try {
                const response2 = await api.get(`/lists/search?name=${term}`);

                if (response2.data && response2.data.length !== 0) {
                    response2.data = response2.data.slice(0, 3);
                    listResults = response2.data;
                }
            } catch (error) {
                //console.error("Errore durante la ricerca delle liste: " + error);
            }

            // Check both results and update state accordingly
            if (movieResults.length === 0 && listResults.length === 0) {
                setNoResults(true);
            } else {
                setNoResults(false);
                setResults([...movieResults, ...listResults]);
            }
        }, 500),
        [setSearchTerm, setResults, setNoResults]
    );


    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                tabIndex={0}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <GoSearch className="w-5 h-5 text-gray-400"/>
            </div>
            {(results.length > 0 || noResults) && <SearchResults results={results} noResults={noResults}/>}
        </div>
    );
};

export default SearchBar;
