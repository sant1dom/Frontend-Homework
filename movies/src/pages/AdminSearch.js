import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import MovieRow from "../components/MovieRow";
import {store} from "../store/store";

const AdminSearch = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        console.log("Faccio partire la ricerca");

        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        api.get('/movies').then((response) => {

            const tempMovies = response.data.map((movie) => {
                return <MovieRow movie={movie} key={movie.id}/>
            });
            setMovies(tempMovies);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    if (!authState.is_superuser) {
        return (<></>);
    }

    return (
        <div className="container mx-auto">
            <h1>
                Films found: {movies.length}
            </h1>
            <Link
                key='admin/create'
                to='/admin/create'
            >
                Add a new film
            </Link>

            <h4>or</h4>

            <h2>Edit/Delete existing films</h2>

            <table>
                <thead>
                <tr>
                    <th>Film</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                    {movies}
                </tbody>
            </table>
        </div>
    );
}

export default AdminSearch;