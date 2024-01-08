import { useEffect, useState } from 'react';
import { FaHeart, FaClock, FaPlus } from 'react-icons/fa';
import api from "../utils/api";
import Button from '../components/Button';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";
import {GoClockFill} from "react-icons/go";
import {FiClock} from "react-icons/fi";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Movie = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [imdbData, setIMDBData] = useState(null);
    const [favourites, setFavourites] = useState([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [isWatchlist, setIsWatchlist] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [selectedList, setSelectedList] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupDescription, setPopupDescription] = useState('');
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
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data;
    };

    useEffect(() => {
        fetchMovieData();
        const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
        setFavourites(storedFavourites);
        const storedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(storedWatchlist);
        if (selectedList) {
            // Esegui l'azione di salvataggio del film nella lista selezionata
            console.log(`Salva il film nella lista: ${selectedList.name}`);
        }
    }, [id], [selectedList]);

    if (!movie) {
        return <div>Loading...</div>;
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

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const openCreateListPopup = () => {
        setPopupVisible(true);
        setShowDropdown(!showDropdown);
    };

    const closeCreateListPopup = () => {
        setPopupVisible(false);
        setPopupTitle('');
        setPopupDescription('');
    };

    const createNewList = () => {
        if (popupTitle.trim() === '') {
            return;
        }
        if (newListName.trim() === '') {
            return;
        }

        // Crea una nuova lista
        const newList = {
            name: popupTitle,
            description: popupDescription,
            id: Date.now(), // Puoi utilizzare un ID univoco
        };

        //TODO: Creare lista sul DB

        // Imposta la lista appena creata come lista selezionata
        closeCreateListPopup();
    };

    const handleSaveToExistingList = (list) => {
        // Implementa l'azione di salvataggio del film nella lista esistente
        console.log(`Salva il film nella lista: ${list.name}`);
        setSelectedList(list);
    };

    const clearSelectedList = () => {
        setSelectedList(null);
    };

    return (
        <div className="mx-auto">
            <h1 className="mt-5 mb-5 text-4xl">{movie.title}</h1>
            <div className="mx-8 flex flex-col lg:flex-row justify-center items-center lg:items-start">
                <div className="rounded-lg bg-sky-100 shadow-2xl max-w-72">
                    <img className="rounded-t-lg w-70 h-90" src={imdbData.Poster} alt="Film"/>
                    <div className="p-4">
                        <div className="mt-2 flex flex-col items-center">
                            <div className="flex space-x-2">
                                <Button label={isFavourite ? <IoMdHeart /> : <IoMdHeartEmpty />} rounded={true} onClick={() => handleFavourites(movie.id)}/>
                                <Button label={isWatchlist ? <FiClock /> : <GoClockFill />} rounded={true} onClick={() => handleWatchlist(movie.id)}/>
                                <div className="relative group inline-block">
                                    <Button label={<FaPlus />} rounded={true} onClick={toggleDropdown} />
                                    {showDropdown && (
                                        <div className="absolute left-0 bottom-[112%] w-36 bg-white border rounded-lg shadow-lg">
                                            <ul className="p-2">
                                                {favourites.map((list) => (
                                                    <li
                                                        key={list.id}
                                                        className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                                                        onClick={() => handleSaveToExistingList(list)}
                                                    >
                                                        {list.name}
                                                    </li>
                                                ))}
                                                <li
                                                    className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                                                    onClick={openCreateListPopup}
                                                >
                                                    <FaPlus className="mr-2 inline" />New List
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-3/5 lg:pl-10">
                    <ul className="list-spacing">
                        <li className="text-left"><strong>Year:</strong> {movie.release_year}</li>
                        <li className="text-left"><strong>Genre:</strong> {movie.genre}</li>
                        <li className="text-left"><strong>Length:</strong> {movie.movie_length}</li>
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
            {popupVisible && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-2">Crea Nuova Lista</h2>
                    <input
                        type="text"
                        placeholder="Titolo"
                        value={popupTitle}
                        onChange={(e) => setPopupTitle(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <textarea
                        placeholder="Descrizione"
                        value={popupDescription}
                        onChange={(e) => setPopupDescription(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <button
                        className="bg-blue-500 text-white rounded-full py-1 px-2 hover:bg-blue-600"
                        onClick={createNewList}
                    >
                        Crea
                    </button>
                    <button
                        className="bg-gray-200 text-gray-700 rounded-full py-1 px-2 ml-2 hover:bg-gray-300"
                        onClick={closeCreateListPopup}
                    >
                        Annulla
                    </button>
                </div>
            )}
        </div>

    );
}

export default Movie;
