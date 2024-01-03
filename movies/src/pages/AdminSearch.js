import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminMovie from "../components/AdminMovie";
import {store} from "../store/store";

const AdminSearch = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);
    const [phase, setPhase] = useState("Loading");

    useEffect(() => {
        console.log("Faccio partire la ricerca");

        console.log('Initial state: ', store.getState())

        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        api.get('/movies').then((response) => {
            setPhase("Loaded " + response.data.length + " movies")

            const tempMovies = response.data.map((movie) => {
                return <AdminMovie movie={movie} key={movie.id}/>
            });
            console.log(tempMovies);
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
            <div>
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
        </div>
    );
}

export default AdminSearch;