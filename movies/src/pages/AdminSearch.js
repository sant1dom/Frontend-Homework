import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import AdminMovie from "../components/AdminMovie";

const AdminSearch = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!authState.is_superuser) {
            navigate('/');
        }
    }, []);

    if (!authState.is_superuser) {
        return <div></div>;
    }

    alert("Lancio");

    api.get('/movies').then((response) => {
        console.log(response.data);
        alert("Ottengo");

        /*
        setMovies(response.data.map((movie) => {
            return <AdminMovie movie={movie} key={movie.id}/>
        }));
        */
    }).catch((error) => {
        console.log(error);
    });


    return (
        <div>
            <div className="container mx-auto">
                <h1 className="text-2xl">AdminSearch</h1>
                <div>

                </div>
            </div>
        </div>
    );
}

export default AdminSearch;