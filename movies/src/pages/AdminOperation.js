import Input from "../components/Input";
import React, {useEffect, useRef, useState} from "react";
import api from "../utils/api";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import PopupMsg from "../components/PopupMsg";

const AdminOperation = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState([]);

    const authState = useSelector((state) => state.auth);
    const values = useSelector((state) => state.genericState.input);

    const path = window.location.pathname.split("/");
    const method = path[2];

    let pageTitle = "Create a new movie";
    let movie_id = null;
    if (method == "update") {
        pageTitle = "Edit an existing movie";
        movie_id = path[3];
    }

    useEffect(() => {
        console.log("Faccio partire Operation");

        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        if (method == "create") {
            console.log("Creo i campi");

            setInputs([
                <Input key="title" field="title" value={""}
                       label="Title" type="text"/>,
                <Input key="release_year" field="release_year" value={""}
                       label="Release year" type="number" min={1800} max={2050}/>,
                <Input key="movie_length" field="movie_length" value={""}
                       label="Length" type="number" min={0} max={999}/>,
                <Input key="genre" field="genre" value={""}
                       label="Genre" type="text"/>,
                <Input key="language" field="language" value={""}
                       label="Language" type="text"/>,
                <Input key="imdb_url" field="imdb_url" value={""}
                       label="IMDB's URL" type="text"/>,
            ]);
        } else if (method == "update") {

            if (isNaN(movie_id)) {
                navigate('/');
                return;
            }

            api.get('/movies/' + movie_id).then((response) => {
                setInputs([
                    <Input key="title" field="title" value={response.data.title}
                           label="Title" type="text"/>,
                    <Input key="release_year" field="release_year" value={response.data.release_year}
                           label="Release year" type="number" min={1800} max={2050}/>,
                    <Input key="movie_length" field="movie_length" value={response.data.movie_length}
                           label="Length" type="number" min={0} max={999}/>,
                    <Input key="genre" field="genre" value={response.data.genre}
                           label="Genre" type="text"/>,
                    <Input key="language" field="language" value={response.data.language}
                           label="Language" type="text"/>,
                    <Input key="imdb_url" field="imdb_url" value={response.data.imdb_url}
                           label="IMDB's URL" type="text"/>,
                ]);
            }).catch((error) => {
                console.log(error);

                navigate("/admin/search");
                dispatch(PopupMsg("Movie does not exist. Redirected to Admin Search"));
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

        if (count_error > 0) {
            return;
        }

        console.log(formData);

        const handleError = (error) => {
            const details = error.response.data.detail;

            let error_msg = "";
            for (let i in details) {
                const detail = details[i];
                error_msg += detail.msg + ": " + detail.loc[1] + ". ";
            }

            dispatch(PopupMsg(error_msg));
        };

        if (method == "update") {
            api.put('/movies/' + movie_id, JSON.stringify(formData))
                .then((response) => {

                    navigate("/admin/search");
                    dispatch(PopupMsg("Movie updated successfully. Redirected to Admin Search"));

                }).catch((error) => {
                handleError(error);
            });

        } else if (method == "create") {
            api.post('/movies/', JSON.stringify(formData))
                .then((response) => {
                    console.log(response.data.id);

                    navigate("/admin/search");
                    dispatch(PopupMsg("Movie created successfully. Redirected to Admin Search"));

                }).catch((error) => {
                handleError(error);
            });
        }
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">{pageTitle}</h1>
            <br/>

            <form>
                {inputs}
                <button onClick={sendMovieForm}>
                    Save
                </button>
            </form>
        </div>
    );
}

export default AdminOperation;