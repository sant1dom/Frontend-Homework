import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import MovieRow from "../components/MovieRow";
import ButtonLink from "../components/ButtonLink";

const AdminMovieSearch = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Faccio partire la ricerca");

        api.get('/movies').then((response) => {

            dispatch({
                type: "hiddenState/clear",
                payload:
                    {
                        table: "movie",
                    }
            });

            const tempMovies = response.data.map((movie) => {
                return <MovieRow movie={movie} key={movie.id}/>
            });
            setMovies(tempMovies);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">Films found: {movies.length}</h1>
            <div className="h-4"/>

            <ButtonLink
                rounded={true}
                key='admin/create'
                to='/admin/create'
                label="Add a new film"
            />
            <div className="h-4"/>

            <div>
                {movies}
            </div>

        </div>
    );
}

export default AdminMovieSearch;