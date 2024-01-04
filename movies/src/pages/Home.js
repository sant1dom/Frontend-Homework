import { useEffect, useState } from 'react';
import api from "../utils/api";
import Button from '../components/Button';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/movies");
                setMovies(res.data);  
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="mx-auto">
            <h1 className="text-2xl">Home</h1>
            <div className="mx-8 grid grid-cols-5 gap-8">
                {movies.map(movie => (
                    <div key={movie.id} className="rounded-lg bg-sky-100 shadow-2xl">
                        <figure><img src="https://img.freepik.com/premium-vector/illustration-operator-director-icon-man-with-movie-camera-logo-studio_15870-1299.jpg" alt="Film" /></figure>
                        <div className="p-4">
                            <h2 className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{movie.title}</h2>
                            <p className="text-base">{movie.release_year}</p>
                            <div className="mt-2">
                                <Button label="IMDB Page" rounded={true} onClick={() => window.location.href = movie.imdb_url}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;