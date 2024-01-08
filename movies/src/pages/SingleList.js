import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from "../utils/api";
import axios from 'axios';
import Filter from '../components/Filter';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const SingleList = () => {
    const { listname } = useParams();
    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');

    // Array of unique genres and languages based on fetched movies
    const genres = [...new Set(movies.map((movie) => movie.data.genre))];
    const languages = [...new Set(movies.map((movie) => movie.data.language))];

    const filteredMovies = movies.filter((movie) => {
        const genreCondition = !selectedGenre || movie.data.genre === selectedGenre;
        const languageCondition = !selectedLanguage || movie.data.language === selectedLanguage;
        const startYearCondition = !startYear || parseInt(movie.data.release_year) >= parseInt(startYear);
        const endYearCondition = !endYear || parseInt(movie.data.release_year) <= parseInt(endYear);
    
    return genreCondition && languageCondition && startYearCondition && endYearCondition;
      });

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };

    const localStorageLists = () => {
        const lists = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const items = JSON.parse(localStorage.getItem(key)) || [];
       
          lists.push({
            name: key,
            items: items
          });
        }
       
        return lists;
    }
    
    function getListByName(name) {
        return localStorageLists().find(list => list.name.toLowerCase() === name.toLowerCase());
       }
       
    function fetchMovies(listName) {
        const list = getListByName(listName);
        
        if (!list) {
            console.error('Collection not found');
            return;
        }
        
        const res = list.items.map(key => api.get('/movies/' + key));
        return res;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movies = fetchMovies(listname);
                const items = await Promise.all(movies);
                const moviesWithPosters = await Promise.all(items.map(async (movie) => {
                    movie.poster = await fetchMoviePoster(movie.data.imdb_url.split('/')[4]);
                    return movie;
                }));
                setMovies(moviesWithPosters);      

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return(
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">{listname}</h1>
            <Filter
            genres={genres}
            languages={languages}
            onGenreChange={setSelectedGenre}
            onLanguageChange={setSelectedLanguage}
            onStartYearChange={setStartYear}
            onEndYearChange={setEndYear}
        />
            <div className="mx-8 grid grid-cols-6 gap-8">
                {filteredMovies.map((movie) => (
                    <div key={movie.data.id} className="rounded-lg bg-sky-100 shadow-2xl">
                        <Link to={`/movie/${movie.data.id}`} className="block">
                            <div className="relative rounded-t-lg pb-80">
                                <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg" src={movie.poster} alt="Film" />
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/movie/${movie.data.id}`} className="block">
                                <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.data.title}</h2>
                            </Link>
                            <p className="text-base">{movie.data.release_year}</p>
                        </div>
                    </div>
                 ))
                }
            </div>
        </div>
    );
}

export default SingleList;