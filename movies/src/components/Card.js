import propTypes from 'prop-types';
import React, {useEffect, useState} from "react";
import Button from "./Button";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";
import {FiClock} from "react-icons/fi";
import {GoClockFill} from "react-icons/go";
import {FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import Cookies from "js-cookie";
import api from "../utils/api";
import Modal from "./Modal";
import {useSelector} from "react-redux";

const Card = ({type, img, text, element}) => {

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

    // useEffect(() => {
    //     document.addEventListener("keydown", handleEscape, false);
    //     return () => {
    //         document.removeEventListener("keydown", handleEscape, false);
    //     };
    // }, [handleEscape])

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
                const response = await api.post(`/mylists/${list.id}`, null,{
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
                        movies: list.movies,
                    };
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
        <div key={element.id} className={color}>
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
                    <div className="p-2">
                        <div className="flex flex-col items-center">
                            <div className="flex space-x-2">
                                <Button label={<FaEdit />} rounded={true} onClick={() => editList(element)} size={'small'}/>
                                <Button label={<FaTrash/>} rounded={true} onClick={() => showDeletePopup(element.id)} size={'small'} variant={'secondary'}/>
                            </div>
                        </div>
                    </div>
                ) : null
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
            )}
        </div>
    );
}

Card.propTypes = {
    type: propTypes.string.isRequired,
    img: propTypes.string.isRequired,
    text: propTypes.element,
    element: propTypes.element.isRequired
};

export default Card;
