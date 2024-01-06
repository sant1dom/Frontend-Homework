import { useEffect, useState } from 'react';
import { FaHeart, FaClock, FaPlus } from 'react-icons/fa';
import api from "../utils/api";
import Button from '../components/Button';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Movie = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [imdbData, setIMDBData] = useState(null);

    const fetchMovieData = async () => {
        try {
            const res = await api.get(`/movies/${id}`);
            const movieData = res.data;
            const imdbData = await fetchIMDBData(movieData.imdb_url.split('/')[4]);
            setMovie(movieData);
            setIMDBData(imdbData);
        } catch (error) {
            console.error("Error fetching movie data:", error);
        }
    };

    const fetchIMDBData = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data;
    };

    useEffect(() => {
        fetchMovieData();
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">{movie.title}</h1>
            <div className="mx-8 flex flex-col lg:flex-row justify-center items-center lg:items-start">
                <div className="rounded-lg bg-sky-100 shadow-2xl" style={{ maxWidth: "18rem" }}>
                    <img className="rounded-t-lg w-70 h-90" src={imdbData.Poster} alt="Film"/>
                    <div className="p-4">
                        <div className="mt-2 flex flex-col items-center">
                            <div className="flex space-x-2">
                                <Button label={<FaHeart />} rounded={true} />
                                <Button label={<FaClock />} rounded={true} />
                                <Button label={<FaPlus />} rounded={true} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-3/5 lg:pl-10">
                    <ul className="list-spacing">
                        <li className="text-left"><strong>Year:</strong> {movie.release_year}</li>
                        <li className="text-left"><strong>Genre:</strong> {movie.genre}</li>
                        <li className="text-left"><strong>Length:</strong> {movie.movie_length}</li>
                        <li className="text-left"><strong>Language:</strong> {movie.language}</li>
                        <li className="text-left"><strong><a href={movie.imdb_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Pagina IMDB</a></strong></li>
                        <li className="text-left mt-3"><strong>Plot</strong></li>
                        <li className="text-left">{imdbData.Plot}</li>
                        <li className="text-left mt-3"><strong>Director</strong></li>
                        <li className="text-left">{imdbData.Director}</li>
                        <li className="text-left mt-3"><strong>Ratings</strong></li>
                        {imdbData.Ratings.map((rating, index) => (
                            <li key={index} className="text-left">
                                {rating.Source}: {rating.Value}
                            </li>
                        ))}
                        <li className="text-left mt-3"><strong>Box Office</strong></li>
                        <li className="text-left">{imdbData.BoxOffice}</li>
                    </ul>
                </div>


            </div>
        </div>

    );
}

export default Movie;
