import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import {Link} from 'react-router-dom';
import {GoSearch} from "react-icons/go";
import api from "../utils/api";

// Store API keys in .env file
const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const SearchResult = ({result}) => (
    <Link to={`/films/${result.id}`} key={result.id}>
        <div
            className="flex items-center p-2 hover:bg-gray-200 cursor-pointer transition ease-in-out duration-150 border">
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

const NoResults = () => (
    <div className="flex items-center p-2 border">
        <span>No results</span>
    </div>
);


const SearchResults = ({results, noResults, error}) => (
    <div className="absolute z-10 bg-white w-full mt-1">
        {results.map((result) => (
            <SearchResult key={result.id} result={result}/>
        ))}
        {noResults && <NoResults/>}
    </div>
);

const fetchMovieData = async (movieId) => {
    const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movieId}`);
    return response.data.Poster;
};

const SearchBar = ({placeholder = 'Search...'}) => {
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useCallback(
        debounce(async (term) => {
            setSearchTerm(term);
            if (term.length < 3) {
                setResults([]);
                setNoResults(false);
                return;
            }
            try {
                const response = await api.get(`/movies/search?title=${term}`);
                const moviesWithPosters = await Promise.all(response.data.map(async (movie) => {
                    movie.poster = await fetchMovieData(movie.imdb_url.split('/')[4]);
                    return movie;
                }));
                setResults(response.data);
                setNoResults(false);
            } catch (e) {
                console.error(e);
                setNoResults(true);
            }
        }, 500),
        []
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
