import {FaPlus} from 'react-icons/fa';
import Button from '../components/Button';
import api from '../utils/api';
import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {useSelector} from "react-redux";
import Modal from "../components/Modal";
import Card from "../components/Card";


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
                    console.log(DBLists)
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

    const removeList = (listId) => {
        setDBLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    };

    const createNewList = async () => {
        if (listTitle.trim() === '') {
            return;
        }

        const newList = {
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

                handleAddCard(response.data);
                closeCreateListPopup();

            } catch (error) {
                // Gestisci gli errori qui
                console.error('Errore nella creazione della lista:', error);
            }
        }
    };

    const popupBody = <><input
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
    </>

    return (
        <div className="mx-auto">
            
            <div className="mx-8 mb-5">
                <h1 className="mt-5 mb-5 text-4xl">My Private Lists</h1>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8'>
                    {DBLists.filter(list => list.private).map((list) => (
                        <div key={list.id} className='flex justify-center'>
                            <Card
                                classes={" flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer w-60"}
                                type={"list"}
                                text={<h2
                                    className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{list.name}</h2>
                                }
                                element={list}/>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mx-8 mb-5">
                <h1 className="mt-5 mb-5 text-4xl">My Public Lists</h1>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
                    {DBLists.filter(list => !list.private).map((list) => (
                        <div key={list.id} className='flex justify-center'>
                        <Card key={list.id}
                            classes={" flex flex-col justify-between hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer w-60"}
                            type={"list"}
                            text={<h2
                                className="text-xl mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">{list.name}</h2>
                            }
                            element={list}
                            removeList={removeList}/>
                        </div>
                    ))}
                    <div className='flex justify-center'>
                    <div className="rounded-lg bg-amber-300 shadow-2xl  max-w-72">
                        <div className="flex items-center justify-center h-full w-60">
                            <Button label={<FaPlus size="6rem"/>} variant="nobg" onClick={openCreateListPopup} size={'max'}/>
                        </div>
                    </div>
                    </div>



                    {popupVisible && (
                        <Modal
                            title="Create new list"
                            body={popupBody}
                            onClose={() => {
                                closeCreateListPopup();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyLists;