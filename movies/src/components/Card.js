import propTypes from 'prop-types';
import React, {useEffect, useState} from "react";
import Button from "./Button";
import {FaEdit, FaPlus, FaRegComment, FaTrash} from "react-icons/fa";
import {BiLike} from "react-icons/bi";
import Cookies from "js-cookie";
import api from "../utils/api";
import Modal from "./Modal";
import {useSelector} from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";
import FeedbackMessage from "./FeedbackMessage";
import Dropdown from "./Dropdown";

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const Card = ({type, classes, img, text, element, removeMovieFromList, removeList}) => {

    const [movies, setMovies] = useState([]);
    const [collageMovies, setCollageMovies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [createPopupVisible, setCreatePopupVisible] = useState(false);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [listTitle, setListTitle] = useState('');
    const [cardTitle, setCardTitle] = useState('');
    const [initialState, setInitialState] = useState(true);
    const [popupTitle, setPopupTitle] = useState('Create new list');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("Operazione eseguita");
    const authState = useSelector((state) => state.auth);
    const [isDeleted, setIsDeleted] = useState(false);
    const [errorVisibility, setErrorVisibility] = useState("hidden");
    const token = Cookies.get("access-token");
    const [author, setAuthor] = useState('');
    const [avatar, setAvatar] = useState('');


    useEffect(() => {
        if (token) {
            if (type === 'best-lists') {
                const fetchAuthor = async () => {
                    api.get('/users/' + element.user_id).then((response) => {
                        setAuthor(response.data.email);
                        setAvatar(process.env.REACT_APP_BASE_URL + "/" + response.data.image);
                    });
                };
                fetchAuthor();
            }
            if (type === 'list') {
                if (element.id) {
                    const fetchData = async () => {
                        api.get(`/mylists/${element.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            }).then((response) => {
                                console.log(response.data)
                                setMovies(response.data.movies.slice(0, 4)); // Prendi i primi 4 film
                            }
                        )
                        const moviesWithPosters = await Promise.all(movies.map(async (movie) => {
                            movie.poster = await fetchMoviePoster(movie.imdb_url.split('/')[4]);
                            return movie;
                        }));
                        setMovies(moviesWithPosters);
                        setCollageMovies(moviesWithPosters.slice(0, 4));
                    }
                    fetchData();
                }
            }
        }
    }, [element.id]);

    const fetchMoviePoster = async (IMDBId) => {
        const response = await axios.get(`http://omdbapi.com/?apikey=${OMDB_API_KEY}&i=${IMDBId}`);
        return response.data.Poster;
    };

    const fetchUserLists = async (movie_id) => {
        if (token) {
            try {
                const response = await api.post("/get_not_lists_for_movie/", null, {
                    params: {movie_id},
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

    const toggleDropdown = async (movie_id) => {

        const userLists = await fetchUserLists(movie_id);
        setUserLists(userLists);

        setShowDropdown(!showDropdown);
    };

    const showAndHideFeedbackMessage = (message, duration) => {
        setFeedbackMessage(message);
        setShowFeedback(true);

        setTimeout(() => {
            setShowFeedback(false);
            setFeedbackMessage('');
        }, duration);
    };

    const openCreateListPopup = () => {
        setPopupTitle("Create new list")
        setCreatePopupVisible(true);
        setErrorVisibility("hidden")

        setShowDropdown(!showDropdown);
    };

    const closeCreateListPopup = () => {
        setCreatePopupVisible(false);
        setListTitle('');
    };


    const createNewList = async (list) => {
        const token = Cookies.get("access-token");
        if (token) {
            if (popupTitle === "Create new list") { //Create list
                if (listTitle.trim() === '') {
                    setErrorVisibility("")
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

                    showAndHideFeedbackMessage("Movie added to the new list!", 2000);

                } catch (error) {
                    // Gestisci gli errori qui
                    console.error('Errore nella creazione della lista:', error);
                }

            } else if (popupTitle === "Edit list") { //Edit list
                try {
                    if (listTitle.trim() === '') {
                        setErrorVisibility("")
                        return;
                    }
                    const updateList = {
                        name: listTitle,
                        movies: movies,
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
                    element = response.data;
                    setInitialState(false)

                } catch (error) {
                    console.error('Errore nella modifica della lista:', error);
                }
            }
        }
    };

    const editList = (list) => {
        if (list.name === "Watchlist" || list.name === "Favourites") {
            return;
        }
        setPopupTitle("Edit list")
        setCreatePopupVisible(true);
        setListTitle(list.name)
    };

    const deleteList = async (list) => {
        if (list.name === "Watchlist" || list.name === "Favourites") {
            return;
        }
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
                removeList(element.id)
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

    const handleWriting = (title) => {
        setListTitle(title);
        setErrorVisibility("hidden")
    };

    const popupBody =
        <>
            <div className={"w-full p-2 mb-2"}>
                <input
                    type="text"
                    placeholder="Titolo"
                    value={listTitle}
                    onChange={(e) => handleWriting(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                />
                <p className={"text-red-600 " + errorVisibility}>Write a title</p>
            </div>
            <Button onClick={() => createNewList(element)}
                    classes={"bg-blue-500 text-white rounded-full py-1 px-2 hover:bg-blue-600"} label={"Send"}/>
            <Button onClick={closeCreateListPopup} variant={'cancel'}
                    classes={" rounded-full py-1 px-2 ml-2 hover:bg-gray-300"} label={"Cancel"}/>
        </>

    const deletePopupButtons =
        <div>
            <Button onClick={closeDeletePopup} variant={'cancel'}
                    classes={"bg-gray-200 text-black rounded-full py-1 px-2 hover:bg-gray-300"} label={"Cancel"}/>
            <Button onClick={() => deleteList(element)}
                    classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-red-600 ml-2"} label={"Delete"}/>
        </div>;

    const color = type === 'movie' || type === 'my-movie' ? 'rounded-lg bg-sky-100 shadow-2xl max-w-72' : 'rounded-lg bg-amber-300 shadow-2xl max-w-72';


    return (
        <>
            {!isDeleted && (
                <div key={element.id} className={color + classes}>
                    {img}
                    {initialState ? <div>{text}</div> : <h2
                        className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{cardTitle}</h2>}

                    {authState.isAuth && (
                        type === 'movie' ? (
                            <div className="p-4">
                                <div className="mt-2 flex flex-col items-center">
                                    <div className="group inline-block relative">
                                        <Button label={<FaPlus/>} rounded={true}
                                                onClick={() => toggleDropdown(element.id)}/>
                                        {showDropdown && (
                                            <Dropdown movie={element}
                                                      elements={userLists}
                                                      toggleDropdown={toggleDropdown}
                                                      showAndHideFeedbackMessage={showAndHideFeedbackMessage}
                                                      openCreateListPopup={openCreateListPopup}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : type === 'list' ? (
                            <>
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
                                        <div className="flex space-x-2"
                                            style={{visibility: element.private ? 'hidden' : 'visible'}}>
                                            <Button label={<FaEdit/>} rounded={true}
                                                    onClick={() => editList(element)} size={'small'}
                                                    disabled={element.private}
                                                    variant={element.private ? 'nobg' : 'secondary'}/>
                                            <Button label={<FaTrash/>} rounded={true}
                                                    onClick={() => showDeletePopup(element.id)} size={'small'}
                                                    disabled={element.private}
                                                    variant={element.private ? 'nobg' : 'secondary'} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : type === 'best-lists' ? (
                            <>
                                <Link to={`/bestlists/${element.id}`} className="block">
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
                                <div className="pb-2">
                                    <div className="flex flex-col items-center">
                                        <div className="flex pb-2">
                                            <img className="object-cover w-8 h-8 border-2 border-gray-300 rounded-full mr-1"
                                                src={avatar}/>
                                            <span className=''>{author}</span>
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <BiLike size={21}/>
                                                <span className=''>{element.likes.length}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FaRegComment size={21}/>
                                                <span>{element.comments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : type === 'my-movie' ? (
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-5 ml-5 mr-5 relative">
                                    <Button label={<FaPlus/>} rounded={true}
                                            onClick={() => toggleDropdown(element.id)}/>
                                    {showDropdown && (
                                        <Dropdown movie={element} elements={userLists} toggleDropdown={toggleDropdown} showAndHideFeedbackMessage={showAndHideFeedbackMessage}/>
                                    )}
                                    <Button label={<FaTrash/>} rounded={true} variant="cancel"
                                            onClick={() => removeMovieFromList(element.id)}/>
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
                    title="Are you sure you want to delete this list?"
                    body={deletePopupButtons}
                    onClose={() => {
                        closeDeletePopup();
                    }}
                />
            )}
            {showFeedback && (
                <FeedbackMessage
                    message={feedbackMessage}
                />
            )}
        </>
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
