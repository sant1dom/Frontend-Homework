import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../utils/api";
import LoadingCardSkeleton from '../components/LoadingCardSkeleton';
import axios from 'axios';
import Card from "../components/Card";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMoviePoster = async (IMDBId) => {
        try {
            const response = await axios.get(`https://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
            return response.data.Poster;
        } catch(error) {
            console.error("Errore durante il recupero delle immagini: "+error)
        }

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
        // Avoid scrolling to the bottom of the page when landing from react router navigation
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <h1 className="mt-5 mb-5 text-4xl">Trending Films</h1>
        <div className="mx-auto">
            <div className="mx-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-5">
                {loading ? (
                    Array.from({ length: 5 }).map((_) => (
                            <LoadingCardSkeleton key={Math.random()}/>                 
                    ))
                ) : (
                    movies.map((movie) => (
                        <div key={movie.id} className='flex justify-center'>
                        <Card key={movie.id}
                              classes={" flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer w-52"}
                              type={'movie'}
                              img={<Link to={`/movie/${movie.id}`} className="block">
                                  <img className="h-80 object-cover rounded-t-lg -z-20" src={movie.poster} alt="Film" />
                              </Link>}
                              text={<div>
                                  <Link to={`/movie/${movie.id}`} className="block">
                                      <h2 className="px-4 py-2 text-xl mb-2 truncate">{movie.title}</h2>
                                  </Link>
                                  <p className="text-base">{movie.release_year}</p></div>}
                              element={movie} />
                        </div>
                    ))
                )
                }
            </div>
        </div>
        </>
    );
}

export default Home;