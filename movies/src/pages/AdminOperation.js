import Input from "../components/Input";
import React, {useEffect, useRef, useState} from "react";
import api from "../utils/api";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AdminOperation = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const values = useSelector((state) => state.genericState.input);
    const movieForm = useRef();

    const path = window.location.pathname.split("/");
    const method = path[1];

    let pageTitle = "Create a new movie";
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
                //TODO
                console.log(response.data);
            }).catch((error) => {
                //TODO
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

        for (let i in inputs) {
            const input = inputs[i];
            const field = input.props.field;
            const value = values[field];

            if (field == "movie_length" || field == "release_year") {
                formData[field] = parseInt(value);
            } else {
                formData[field] = value;
            }

            if (value.length == 0) {
                count_error++;
            }
        }

        console.log(formData);

        if (count_error > 0) {
            return;
        }

        if (method == "update") {
            api.put('/movies/' + movie_id, JSON.stringify(formData)).then((response) => {
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

    const inputs = [
        <Input key="title" field="title" label="Title" type="text"/>,
        <Input key="release_year" field="release_year" label="Release year" type="number" min={1800}
               max={2050}/>,
        <Input key="movie_length" field="movie_length" label="Length" type="number" min={0} max={999}/>,
        <Input key="genre" field="genre" label="Genre" type="text"/>,
        <Input key="language" field="language" label="Language" type="text"/>,
        <Input key="imdb_url" field="imdb_url" label="IMDB's URL" type="text"/>,
    ];

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">{pageTitle}</h1>
            <br/>

            <form ref={movieForm}>
                {inputs}
                <br/>
                <button onClick={sendMovieForm}>
                    Save
                </button>
            </form>
        </div>
    );
}

export default AdminOperation;