import Input from "../components/Input";
import React, {useEffect, useRef, useState} from "react";
import api from "../utils/api";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AdminOperation = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const movieForm = useRef();
    let pageTitle = "Create a new movie";

    const path = window.location.pathname.split("/");
    const method = path[1];
    let movie_id = null;

    if (method == "update") {
        pageTitle = "Edit an existing movie";
        movie_id = path[2];
    }

    useEffect(() => {
        console.log("Faccio partire Operation");

        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        if (method == "update") {

            if (isNaN(movie_id)) {
                navigate('/');
                return;
            }

            api.get('/movies/' + movie_id).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            });
        }

    }, []);

    if (!authState.is_superuser) {
        return (<></>);
    }

    const sendMovieForm = (event) => {
        event.preventDefault();

        let count_error = 0;
        let formData = {};

        //TODO 0: input & errori

        const checks = ["title", "release_year", "movie_length", "genre", "language", "imdb_url"];
        for (let i in checks) {
            const field = checks[i];
            const value = document.getElementById(field + "_input").value;
            const error = document.getElementById(field + "_error");

            if (field == "movie_length" || field == "release_year") {
                formData[field] = parseInt(value);
            } else {
                formData[field] = value;
            }

            if (value == "") {
                count_error++;
                error.style.display = "block";
            } else {
                error.style.display = "none";
            }
        }

        if (count_error > 0) {
            return;
        }

        if (method == "update") {
            api.put('/movies/' + movie_id).then((response) => {
                console.log(response.data);

                //TODO 1: check errori

                //TODO 2: Popup
                //openSuccessPopup('Movie updated successfully');
            }).catch((error) => {
                console.log(error);
            });

        } else if (method == "create") {

            //TODO 3: come sopra
            //openSuccessPopup('Movie created successfully');
        }
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">{pageTitle}</h1>
            <br/>

            <form ref={movieForm}>
                <Input key="title" field="title" label="Title" type="text"/>
                <Input key="release_year" field="release_year" label="Release year" type="number" min={1800}
                       max={2050}/>
                <Input key="movie_length" field="movie_length" label="Length" type="number" min={0} max={999}/>
                <Input key="genre" field="genre" label="Genre" type="text"/>
                <Input key="language" field="language" label="Language" type="text"/>
                <Input key="imdb_url" field="imdb_url" label="IMDB's URL" type="text"/>

                <br/>
                <button onClick={sendMovieForm}>
                    Save
                </button>
            </form>
        </div>
    );
}

export default AdminOperation;