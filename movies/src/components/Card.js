import propTypes from 'prop-types';
import React, {useEffect, useState} from "react";
import Button from "./Button";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";
import {FiClock} from "react-icons/fi";
import {GoClockFill} from "react-icons/go";
import {FaEdit, FaPlus, FaTrash, FaRegComment} from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import Cookies from "js-cookie";
import api from "../utils/api";
import Modal from "./Modal";
import {useSelector} from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Card = ({type, classes, img, text, element}) => {

    const [movies, setMovies] = useState([]);
    const [collageMovies, setCollageMovies] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [isWatchlist, setIsWatchlist] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [createPopupVisible, setCreatePopupVisible] = useState(false);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [listTitle, setListTitle] = useState('');
    const [cardTitle, setCardTitle] = useState('');
    const [initialState, setInitialState] = useState(true);
    const [popupTitle, setPopupTitle] = useState('Create new list');
    const [selectedList, setSelectedList] = useState(null);
    const authState = useSelector((state) => state.auth);
    const [isDeleted, setIsDeleted] = useState(false);
    const token = Cookies.get("access-token");


    // useEffect(() => {
    //     document.addEventListener("keydown", handleEscape, false);
    //     return () => {
    //         document.removeEventListener("keydown", handleEscape, false);
    //     };
    // }, [handleEscape])

    useEffect( () => {
        if (token && type === 'list') {
            // api.get(`/mylists/${element.id}`,
            //     {
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //         }
            //     }).then((response) => {
            //         setMovies(response.data.movies.slice(0, 4)); // Prendi i primi 4 film
            //         console.log(movies)
            //     }
            // )
            // api.get("/movies",
            //     {
            //         headers: {
            //             'Authorization': `Bearer ${token}`,
            //         }
            //     }).then((response) => {
            //         setMovies(response.data.slice(0, 4)); // Prendi i primi 4 film
            //         console.log(movies)
            //     }
            // )
            const fetchData = async () => {
                // api.get(`/mylists/${element.id}`,
                //         {
                //             headers: {
                //                 'Authorization': `Bearer ${token}`,
                //             }
                //         }).then((response) => {
                //             setMovies(response.data.movies.slice(0, 4)); // Prendi i primi 4 film
                //             console.log(movies)
                //         }
                //     )
                const res = await api.get("/movies");
                console.log(res);
                console.log(res.data);
                const moviesWithPosters = await Promise.all(res.data.map(async (movie) => {
                    movie.poster = await fetchMoviePoster(movie.imdb_url.split('/')[4]);
                    return movie;
                }));
                setMovies(moviesWithPosters);
                setCollageMovies(moviesWithPosters.slice(0, 4));
            }
            fetchData();
        }
    }, [element.id]);

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };

    const fetchUserLists = async (movie) => {
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

    const toggleDropdown = async (movie) => {

        const userLists = await fetchUserLists(movie);
        setUserLists(userLists);

        setShowDropdown(!showDropdown);
    };

    const openCreateListPopup = () => {
        setPopupTitle("Create new list")
        setCreatePopupVisible(true);

        setShowDropdown(!showDropdown);
    };

    const closeCreateListPopup = () => {
        setCreatePopupVisible(false);
        setListTitle('');
    };

    const handleSaveToExistingList = async (list, movie_id) => {
        const token = Cookies.get("access-token");

        if (token) {
            try {
                const response = await api.post(`/mylists/${list.id}`, element,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        movie_id: movie_id,
                    },
                });

                // Gestisci la risposta, ad esempio aggiornando lo stato o mostrando un messaggio
                console.log('Film salvato nella lista con successo:', response.data);

                setSelectedList(list); // Aggiorna lo stato con la lista selezionata

            } catch (error) {
                // Gestisci gli errori qui
                console.error('Errore nel salvataggio del film nella lista:', error);
            }
        }
        setSelectedList(list);
    };

    const createNewList = async (list) => {
        const token = Cookies.get("access-token");
        if (token) {
            if (popupTitle === "Create new list") { //Create list
                if (listTitle.trim() === '') {
                    return;
                }

                const newList = {
                    user_id: authState.userId,
                    name: listTitle,
                    movies: [element.id],
                    comments: [],
                    likes: []
                };

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

            } else if (popupTitle === "Edit list") { //Edit list
                try {
                    const updateList = {
                        name: listTitle,
                        movies: [], //TODO: Mettere i veri movies
                        //movies: [movies.map(movie => movie.id)],
                    };
                    console.log("movies" + list.movies)
                    const response = await api.put(`/mylists/${list.id}`, updateList, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    // Gestisci la risposta, ad esempio aggiornando lo stato o mostrando un messaggio
                    console.log('Lista modificata con successo:', response.data);

                    closeCreateListPopup();
                    setCardTitle(updateList.name)
                    setInitialState(false)

                } catch (error) {
                    // Gestisci gli errori qui
                    console.error('Errore nella modifica della lista:', error);
                }
            }
        }
    };

    const editList = (list) => {
        setPopupTitle("Edit list")
        setCreatePopupVisible(true);
        setListTitle(list.name)
    };

    const deleteList = async (list) => {
        const token = Cookies.get("access-token");
        if (token) {
            try {
                const response = await api.delete(`/mylists/${list.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setDeletePopupVisible(false);
                setIsDeleted(true);
                return response.data;
            } catch (error) {
                console.log(error);
                return [];
            }
        }
        return [];


    };

    const showDeletePopup = (id) => {
        setDeletePopupVisible(true);
    };

    const closeDeletePopup = (id) => {
        setDeletePopupVisible(false);
    };

    const popupBody = <div><input
        type="text"
        placeholder="Titolo"
        value={listTitle}
        onChange={(e) => setListTitle(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
    />
        <Button onClick={() => createNewList(element)} classes={"bg-blue-500 text-white rounded-full py-1 px-2 hover:bg-blue-600"} label={"Send"}/>
        <Button onClick={closeCreateListPopup} variant={'cancel'} classes={" rounded-full py-1 px-2 ml-2 hover:bg-gray-300"} label={"Cancel"}/>
    </div>

    const deletePopupButtons = <div>
                                            <Button onClick={() => deleteList(element)} classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-blue-600"} label={"DELETE"}/>
                                            <Button onClick={closeDeletePopup} variant={'cancel'} classes={"bg-gray-200 text-black rounded-full py-1 px-2 ml-2 hover:bg-gray-300"} label={"Cancel"}/>
                                        </div>;

    const color = type === 'movie' ? 'rounded-lg bg-sky-100 shadow-2xl max-w-72' : 'rounded-lg bg-amber-300 shadow-2xl max-w-72';


    return (
        <div>
            {!isDeleted && (
                <div key={element.id} className={color + classes + " min-w-[200px]"}>
                        {img}
            {initialState ? <div>{text}</div> : <h2
                className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{cardTitle}</h2>}

            {authState.isAuth && (
                type === 'movie' ? (
                    <div className="p-4">
                        <div className="mt-2 flex flex-col items-center">
                            <div className="flex space-x-2">
                                <Button label={isFavourite ? <IoMdHeart /> : <IoMdHeartEmpty />} rounded={true} onClick={() => handleFavourites(element.id)}/>
                                <Button label={isWatchlist ?  <GoClockFill /> : <FiClock />} rounded={true} onClick={() => handleWatchlist(element.id)}/>
                                <div className="group inline-block relative">
                                    <Button label={<FaPlus />} rounded={true} onClick={() => toggleDropdown(element)} />
                                    {showDropdown && (
                                        <div className="absolute left-0 bottom-[112%] w-36 bg-white border rounded-lg shadow-lg">
                                            <ul className="p-2">
                                                {userLists.map((list) => (
                                                    <li
                                                        key={list.id}
                                                        className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                                                        onClick={() => handleSaveToExistingList(list, element.id)}
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
                ) : type === 'list' ? (
                    <div>
                        <Link to={`/mylists/${element.id}`} className="block">
                            <div className="grid grid-cols-2 grid-rows-2 w-full h-48">
                                {collageMovies.map((movie) => (
                                    <img
                                        key={movie.id}
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="collage-image object-cover w-full h-full"
                                    />
                                ))}
                            </div>
                        </Link>
                        <div className="p-2">
                            <div className="flex flex-col items-center">
                                <div className="flex space-x-2">
                                    <Button label={<FaEdit />} rounded={true} onClick={() => editList(element)} size={'small'}/>
                                    <Button label={<FaTrash/>} rounded={true} onClick={() => showDeletePopup(element.id)} size={'small'} variant={'secondary'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : type === 'best-lists' ? (
                    <div className="p-2">
                        <div className="flex flex-col items-center">
                            <div className="flex space-x-4">
                                <div className="flex items-center space-x-1">
                                    <BiLike size={21}/> 
                                    <span className=''>18</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FaRegComment size={21}/> 
                                    <span>18</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            )}

        </div>
            )}
            {createPopupVisible && (
                <Modal
                    title={popupTitle}
                    body={popupBody}
                    onClose={() => {
                        closeCreateListPopup();
                    }}
                />
            )}
            {deletePopupVisible && (
                <Modal
                    title="Are you sure you want to delete the list?"
                    body={deletePopupButtons}
                    onClose={() => {
                        closeDeletePopup();
                    }}
                />
            )}
        </div>
    );
}

Card.propTypes = {
    type: propTypes.string.isRequired,
    classes: propTypes.string,
    img: propTypes.element,
    text: propTypes.element,
    element: propTypes.object.isRequired
};

export default Card;
