import { useEffect, useState } from 'react';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { GoClockFill } from "react-icons/go";
import { Link } from 'react-router-dom';
import api from "../utils/api";
import Button from '../components/Button';
import LoadingCardSkeleton from '../components/LoadingCardSkeleton';
import axios from 'axios';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const favourites = JSON.parse(localStorage.getItem("Favourites"));
    const watchlist = JSON.parse(localStorage.getItem("Watchlist"));

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
                setLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (localStorage.getItem("Favourites") === null) {
            localStorage.setItem("Favourites", JSON.stringify([]));
        }

        if (localStorage.getItem("Watchlist") === null) {
            localStorage.setItem("Watchlist", JSON.stringify([]));
        }
    }, []);

    const handleFavourites = (id) => {

        const index = favourites.indexOf(id);
        if (index === -1) {
            favourites.push(id);
        } else {
            favourites.splice(index, 1);
        }

        localStorage.setItem("Favourites", JSON.stringify(favourites));
        setHoveredMovie(null);
    };
    
    const handleWatchlist = (id) => {

        const index = watchlist.indexOf(id);
        if (index === -1) {
            watchlist.push(id);
        } else {
            watchlist.splice(index, 1);
        }

        localStorage.setItem("Watchlist", JSON.stringify(watchlist));
        setHoveredMovie(null);
    };

    return (
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">Trending Films</h1>
            <div className="mx-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {loading ? (
                    Array.from({ length: 6 }).map((_) => (
                        <LoadingCardSkeleton />
                    ))
                    ) : (
                        movies.map((movie) => (
                            <div key={movie.id} className="rounded-lg bg-sky-100 shadow-2xl -z-20" onMouseEnter={() => setHoveredMovie(movie.id)}>
                                <Link to={`/movie/${movie.id}`} className="block">
                                <div className="relative rounded-t-lg pb-80">
                                    <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg" src={movie.poster} alt="Film" />
                                </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/movie/${movie.id}`} className="block">
                                    <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.title}</h2>
                                    </Link>
                                    <p className="text-base">{movie.release_year}</p>
                                    <div className={`grid grid-cols-2 gap-2 mt-2 transition duration-500 ease-in-out ${hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'}`}>
                                        <Button label={favourites.includes(movie.id) ? <IoMdHeart /> : <IoMdHeartEmpty />} rounded={true} onClick={() => handleFavourites(movie.id)}/>
                                        <Button label={watchlist.includes(movie.id) ? <GoClockFill /> : <FiClock />} rounded={true} onClick={() => handleWatchlist(movie.id)}/>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default Home;