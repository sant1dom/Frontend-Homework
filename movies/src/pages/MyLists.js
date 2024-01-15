import {Link} from 'react-router-dom';
import {FaPlus} from 'react-icons/fa';
import Button from '../components/Button';
import api from '../utils/api';
import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {useSelector} from "react-redux";
import Modal from "../components/Modal";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";
import {GoClockFill} from "react-icons/go";
import {FiClock} from "react-icons/fi";
import {FaEdit, FaTrash} from 'react-icons/fa';
import Card from "../components/Card";

let lsLists = Object.keys(localStorage);

const MyLists = () => {
    const [DBLists, setDBLists] = useState([]);
    const token = Cookies.get("access-token");
    const [popupVisible, setPopupVisible] = useState(false);
    const [listTitle, setListTitle] = useState('');
    const authState = useSelector((state) => state.auth);


    useEffect(() => {
        if (token) {
            api.get("/mylists",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }).then((response) => {
                    setDBLists(response.data);
                }
            )
        }
    }, []);

    const openCreateListPopup = () => {
        setPopupVisible(true);
    };

    const closeCreateListPopup = () => {
        setPopupVisible(false);
        setListTitle('');
    };

    const handleAddCard = (newList) => {
        setDBLists((prevLists) => [...prevLists, newList]);
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

                handleAddCard(newList);
                closeCreateListPopup();

            } catch (error) {
                // Gestisci gli errori qui
                console.error('Errore nella creazione della lista:', error);
            }
        }
    };

    const popupBody = <div><input
        type="text"
        placeholder="Titolo"
        value={listTitle}
        onChange={(e) => setListTitle(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
    />
        <Button onClick={createNewList} classes={"bg-blue-500 text-white rounded-full py-1 px-2 hover:bg-blue-600"}
                label={"Create"}/>
        <Button onClick={closeCreateListPopup}
                classes={"bg-gray-200 text-black rounded-full py-1 px-2 ml-2 hover:bg-gray-300"} label={"Cancel"}/>
    </div>

    return (
        <div className="container">
            <h1 className="mt-5 mb-5 text-4xl">My Lists</h1>
            <div
                className="mx-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-5">

                {DBLists.map((list) => (
                    <Card img={<Link to={`/mylists/${list.id}`} className="block">
                        <div className="relative rounded-t-lg pb-80">
                            <img className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                 src="https://img.freepik.com/free-vector/casting-call-abstract-concept-vector-illustration-open-call-models-commercial-shootings-photo-video-casting-modelling-agency-request-audition-brand-advertising-abstract-metaphor_335657-4165.jpg?w=740&t=st=1704554272~exp=1704554872~hmac=916b3767c735c328a768477449f8909ea9a9f4b65820ad5679fc467150362ba3"
                                 alt="List"/>
                        </div></Link>}
                          type={"list"}
                          text={<h2
                              className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{list.name}</h2>
                          }
                          element={list}/>
                ))}

                {popupVisible && (
                    <Modal
                        title="Create new list"
                        body={popupBody}
                        onClose={() => {
                            closeCreateListPopup();
                        }}
                    />
                )}

                <div className="rounded-lg bg-amber-300 shadow-2xl  max-w-72">
                    <div className="flex items-center justify-center h-full">
                        <Button label={<FaPlus size="6rem"/>} variant="nobg" onClick={openCreateListPopup}
                                size={'max'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyLists;