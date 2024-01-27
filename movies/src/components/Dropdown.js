import propTypes from 'prop-types';
import {GoX} from "react-icons/go";
import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import Cookies from "js-cookie";
import api from "../utils/api";
import Modal from "./Modal";
import Button from "./Button";
import {useSelector} from "react-redux";
import FeedbackMessage from "./FeedbackMessage";

const Dropdown = ({elements, movie, toggleDropdown, showAndHideFeedbackMessage, openCreateListPopup}) => {

    const [showDropdown, setShowDropdown] = useState(true);



    const handleSaveToExistingList = async (list, movie_id) => {
        const token = Cookies.get("access-token");

        if (token) {
            try {
                const response = await api.post(`/mylists/${list.id}`, movie, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    params: {
                        movie_id: movie_id,
                    },
                });

                // Gestisci la risposta, ad esempio aggiornando lo stato o mostrando un messaggio
                console.log('Film salvato nella lista con successo:', response.data);

                setShowDropdown(false);

                showAndHideFeedbackMessage("Movie added to the list!", 2000);
                toggleDropdown(movie_id);

            } catch (error) {
                // Gestisci gli errori qui
                console.error('Errore nel salvataggio del film nella lista:', error);
            }
        }
    };



    return (<>
            {showDropdown && (
                <div
                    className="absolute left-0 bottom-[112%] w-36 bg-white border rounded-lg shadow-lg">
                    <ul className="p-2">
                        {elements.map((element) => (
                            <li
                                key={element.id}
                                className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                                onClick={() => handleSaveToExistingList(element, movie.id)}
                            >
                                {element.name}
                            </li>
                        ))}
                        <li
                            className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                            onClick={openCreateListPopup}
                        >
                            <FaPlus className="mr-2 inline"/>New List
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}



Dropdown.propTypes = {
    elements: propTypes.array.isRequired,
    movie: propTypes.object.isRequired,
};

export default Dropdown;
