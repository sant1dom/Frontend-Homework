import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminRowMovie from "../components/AdminRowMovie";
import ButtonLink from "../components/ButtonLink";
import Cookies from "js-cookie";

const AdminSearchMovie = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);
    const dispatch = useDispatch();

    const token = Cookies.get("access-token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    useEffect(() => {
        console.log("Faccio partire la ricerca");

        api.get('/movies', config).then((response) => {

            dispatch({
                type: "hiddenState/clear",
                payload:
                    {
                        table: "movie",
                    }
            });

            const tempMovies = response.data.map((movie) => {
                return <AdminRowMovie movie={movie} key={movie.id}/>
            });
            setMovies(tempMovies);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all films</h1>
            <div className="h-4"/>

            <ButtonLink
                rounded={true}
                key='admin/movie/create'
                to='/admin/movie/create'
                label="Add a new film"
            />
            <div className="h-4"/>

            <div>
                {movies}
            </div>

        </div>
    );
}

export default AdminSearchMovie;