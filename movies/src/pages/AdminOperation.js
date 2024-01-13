import Input from "../components/Input";
import React, {useEffect, useRef, useState} from "react";
import api from "../utils/api";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Button from "../components/Button";
import popupStateMsg from "../store/popupStateMsg";

const AdminOperation = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState([]);

    const authState = useSelector((state) => state.auth);
    const values = useSelector((state) => state.inputState.movie);
    const [clickedSave, setClickedSave] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    const path = window.location.pathname.split("/");
    const method = path[2];

    let movieId = null;
    if (method == "update") {
        movieId = path[3];
    }

    useEffect(() => {
        console.log("Faccio partire Operation");

        if (method == "create") {
            setPageTitle("Create a new movie");
        } else if (method == "update") {
            setPageTitle("Edit an existing movie");
        }

        if (!authState.is_superuser) {
            navigate('/');
            return;
        }

        if (method == "create") {
            console.log("Creo i campi");

            setInputs([
                <Input key="title_0" field="title" showError={clickedSave} value=""
                       label="Title" type="text"/>,
                <Input key="release_year_0" field="release_year" showError={clickedSave} value=""
                       label="Release year" type="number" min={1800} max={2050}/>,
                <Input key="movie_length_0" field="movie_length" showError={clickedSave} value=""
                       label="Length" type="number" min={0} max={999}/>,
                <Input key="genre_0" field="genre" showError={clickedSave} value=""
                       label="Genre" type="text"/>,
                <Input key="language_0" field="language" showError={clickedSave} value=""
                       label="Language" type="text"/>,
                <Input key="imdb_url_0" field="imdb_url" showError={clickedSave} value=""
                       label="IMDB's URL" type="text"/>,
            ]);
        } else if (method == "update") {

            if (movieId == null) {
                navigate('/admin/search');
                return;
            }

            api.get('/movies/' + movieId).then((response) => {
                setInputs([
                    <Input key={"title_" + movieId} field="title" showError={clickedSave} value={response.data.title}
                           label="Title" type="text"/>,
                    <Input key={"release_year_" + movieId} field="release_year" showError={clickedSave}
                           value={response.data.release_year}
                           label="Release year" type="number" min={1800} max={2050}/>,
                    <Input key={"movie_length_" + movieId} field="movie_length" showError={clickedSave}
                           value={response.data.movie_length}
                           label="Length" type="number" min={0} max={999}/>,
                    <Input key={"genre_" + movieId} field="genre" showError={clickedSave} value={response.data.genre}
                           label="Genre" type="text"/>,
                    <Input key={"language_" + movieId} field="language" showError={clickedSave} value={response.data.language}
                           label="Language" type="text"/>,
                    <Input key={"imdb_url_" + movieId} field="imdb_url" showError={clickedSave} value={response.data.imdb_url}
                           label="IMDB's URL" type="text"/>,
                ]);
            }).catch((error) => {
                console.log(error);

                navigate("/admin/search");
                dispatch(popupStateMsg("Movie does not exist", "Redirected to Admin Search"));
            });
        }

    }, [method, movieId]);

    if (!authState.is_superuser) {
        return (<></>);
    }

    const sendMovieForm = (event) => {
        event.preventDefault();

        setClickedSave(true);

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
            //return;
        }

        console.log(formData);

        const handleError = (error) => {
            const details = error.response.data.detail;

            let error_msg = "";
            for (let i in details) {
                const detail = details[i];
                error_msg += detail.msg + ": " + detail.loc[1] + ". ";
            }

            dispatch(popupStateMsg("Errors occurred", error_msg));
        };

        if (method == "update") {
            api.put('/movies/' + movieId, JSON.stringify(formData))
                .then((response) => {

                    navigate("/admin/search");
                    dispatch(popupStateMsg("Movie updated", "Redirected to Admin Search"));

                }).catch((error) => {
                handleError(error);
            });

        } else if (method == "create") {
            api.post('/movies/', JSON.stringify(formData))
                .then((response) => {
                    console.log(response.data.id);

                    navigate("/admin/search");
                    dispatch(popupStateMsg("Movie created", "Redirected to Admin Search"));

                }).catch((error) => {
                handleError(error);
            });
        }
    }

    const goBack = (event) => {
        navigate(-1);
    }

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">{pageTitle}</h1>
            <div className="h-4"/>

            <div>
                {inputs}
            </div>

            <Button onClick={goBack} rounded={true} label="Cancel"
                    classes={"mr-2 ml-2 bg-gray-500 hover:bg-gray-600"}/>

            <Button onClick={sendMovieForm} rounded={true} label="Save"
            />
        </div>
    )
        ;
}

export default AdminOperation;