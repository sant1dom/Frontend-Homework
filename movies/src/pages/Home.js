import { useEffect, useState } from 'react';
import api from "../utils/api";
import Button from '../components/Button';
import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Home = () => {
    const [movies, setMovies] = useState([]);

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/movies");
                const moviesWithPosters = await Promise.all(res.data.map(async (movie) => {
                    movie.poster = await fetchMoviePoster(movie.imdb_url.split('/')[4]);
                    return movie;
                }));

                setMovies(moviesWithPosters);      

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">Trending Films</h1>
            <div className="mx-8 grid grid-cols-6 gap-8">
                {movies.map((movie) => (
                    <div key={movie.id} className="rounded-lg bg-sky-100 shadow-2xl">
                        <img className="rounded-t-lg w-60 h-80" src={movie.poster} alt="Film"/>
                        <div className="p-4">
                            <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.title}</h2>
                            <p className="text-base">{movie.release_year}</p>
                            <div className="mt-2">
                                <Button label="IMDB Page" rounded={true} onClick={() => window.location.href = movie.imdb_url}/>
                            </div>
                        </div>
                    </div>
                 ))
                }
            </div>
        </div>
    );
}

export default Home;