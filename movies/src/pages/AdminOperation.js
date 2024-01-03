import Input from "../components/Input";
import React, {useEffect, useRef, useState} from "react";
import api from "../utils/api";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AdminOperation = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const movieForm = useRef();
    let pageTitle = useState("");

    useEffect(() => {
        console.log("Faccio partire Operation");

        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        console.log(window.location.pathname);
        return;

        api.get('/movies').then((response) => {



        }).catch((error) => {
            console.log(error);
        });

    }, []);

    if (!authState.is_superuser) {
        return (<></>);
    }

    const sendMovieForm = (event) => {
        event.preventDefault();
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">AdminOperation</h1>

            <form ref={movieForm}>
                <Input key="title" field="title" label="Title" type="text"/>
                <Input key="release_year" field="release_year" label="Release year" type="number" min={1800} max={2050}/>
                <Input key="movie_length" field="movie_length" label="Length" type="number" min={0} max={999}/>
                <Input key="genre" field="genre" label="Genre" type="text"/>
                <Input key="language" field="language" label="Language" type="text"/>
                <Input key="imdb_url" field="imdb_url" label="IMDB's URL" type="text"/>

                <button onClick={sendMovieForm}>
                    Confirm
                </button>
            </form>
        </div>
    );
}

export default AdminOperation;