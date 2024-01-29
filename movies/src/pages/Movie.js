import React, { useEffect, useState } from 'react';
import api from "../utils/api";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import Cookies from "js-cookie";
import Card from "../components/Card";
import Spinner from "../components/Spinner";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Movie = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [imdbData, setIMDBData] = useState(null);
    const [favourites, setFavourites] = useState([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [isWatchlist, setIsWatchlist] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [selectedList, setSelectedList] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    //const watchlist = JSON.parse(localStorage.getItem("watchlist"));
    const authState = useSelector((state) => state.auth);

    const fetchMovieData = async () => {
        try {
            const res = await api.get(`/movies/${id}`);
            const movieData = res.data;
            const imdbData = await fetchIMDBData(movieData.imdb_url.split('/')[4]);
            setMovie(movieData);
            setIMDBData(imdbData);
        } catch (error) {
            console.error("Error fetching movie data:", error);
        }
    };

    const fetchIMDBData = async (IMDBId) => {
        try {
            const response = await axios.get(`https://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
            return response.data;
        } catch(error) {
            console.error("Errore durante il recupero dei dati da IMDB: "+error)
        }

    };

    const fetchUserLists = async () => {
        const token = Cookies.get("access-token");
        if (token) {
            try {
                const response = await api.get("/mylists", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                return response.data;
            } catch (error) {
                console.log(error);
                return [];
            }
        }
        return [];
    }

    useEffect(() => {
        fetchMovieData();
        const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
        setFavourites(storedFavourites);
        const storedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(storedWatchlist);
        if (selectedList) {
            console.log(`Salva il film nella lista: ${selectedList.name}`);
        }
    }, [id], [selectedList]);

    if (!movie) {
        return <div className={"flex justify-center items-center h-screen "}><Spinner/></div>;
    }

    const handleFavourites = (id) => {

        const index = favourites.indexOf(id);
        if (index === -1) {
            favourites.push(id);
        } else {
            favourites.splice(index, 1);
        }

        localStorage.setItem("favourites", JSON.stringify(favourites));

        setIsFavourite(!isFavourite);
    };
    const handleWatchlist = (id) => {

        const index = watchlist.indexOf(id);
        if (index === -1) {
            watchlist.push(id);
        } else {
            watchlist.splice(index, 1);
        }

        localStorage.setItem("watchlist", JSON.stringify(watchlist));

        setIsWatchlist(!isWatchlist);
    };

    const showLists = (id) => {

        const index = favourites.indexOf(id);
        if (index === -1) {
            favourites.push(id);
        } else {
            favourites.splice(index, 1);
        }

        localStorage.setItem("favourites", JSON.stringify(favourites));
    };


    const closeCreateListPopup = () => {
        setPopupVisible(false);
        setListTitle('');
        setListDescription('');
    };

    const createNewList = async () => {
        if (listTitle.trim() === '') {
            return;
        }

        const newList = {
            id: 1,
            user_id: authState.userId,
            name: listTitle,
            movies: [],
            comments: [],
            likes: []
        };

        console.log(authState)
        const token = Cookies.get("access-token");
        if (token) {
            try {
                const response = await api.post('/mylists', newList, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                // Gestisci la risposta, ad esempio aggiornando lo stato o mostrando un messaggio
                console.log('Lista creata con successo:', response.data);

                closeCreateListPopup();

            } catch (error) {
                // Gestisci gli errori qui
                console.error('Errore nella creazione della lista:', error);
            }
        }
    };


    const handleSaveToExistingList = (list) => {
        //TODO: Implementa l'azione di salvataggio del film nella lista esistente
        console.log(`Salva il film nella lista: ${list.name}`);
        setSelectedList(list);
    };

    const clearSelectedList = () => {
        setSelectedList(null);
    };


    const img = <img className="rounded-t-lg w-70 h-90" src={imdbData.Poster} alt="Film"/>




    return (
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">{movie.title}</h1>
            <div className="mx-8 flex flex-col lg:flex-row justify-center items-center lg:items-start">
                <Card type={'movie'} img={img} element={movie}/>
                <div className="lg:w-3/5 lg:pl-10 mt-2">
                    <ul className="list-spacing">
                        <li className="text-left"><strong>Year:</strong> {movie.release_year}</li>
                        <li className="text-left"><strong>Genre:</strong> {movie.genre}</li>
                        <li className="text-left"><strong>Length:</strong> {movie.movie_length} mins</li>
                        <li className="text-left"><strong>Language:</strong> {movie.language}</li>
                        <li className="text-left"><strong><a href={movie.imdb_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Pagina IMDB</a></strong></li>
                        <li className="text-left mt-3"><strong>Plot</strong></li>
                        <li className="text-left">{imdbData.Plot}</li>
                        <li className="text-left mt-3"><strong>Director</strong></li>
                        <li className="text-left">{imdbData.Director}</li>
                        <li className="text-left mt-3"><strong>Ratings</strong></li>
                        {imdbData.Ratings.map((rating, index) => (
                            <li key={index} className="text-left">
                                {rating.Source}: {rating.Value}
                            </li>
                        ))}
                        <li className="text-left mt-3"><strong>Box Office</strong></li>
                        <li className="text-left">{imdbData.BoxOffice}</li>
                    </ul>
                </div>


            </div>
        </div>

    );
}

export default Movie;
