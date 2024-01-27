import propTypes from 'prop-types';
import {FaPlus, FaTrash} from "react-icons/fa";
import Button from "../Button";
import React from "react";
import Dropdown from "../Dropdown";

const MyMovieCard = ({movie, showDropdown, toggleDropdown, removeMovieFromList, userLists, showAndHideFeedbackMessage}) => {


    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-5 ml-5 mr-5 relative">
                <Button label={<FaPlus/>} rounded={true}
                        onClick={() => toggleDropdown(movie.id)}/>
                {showDropdown && (
                    <Dropdown movie={movie} elements={userLists} toggleDropdown={toggleDropdown} showAndHideFeedbackMessage={showAndHideFeedbackMessage}/>
                )}
                <Button label={<FaTrash/>} rounded={true} variant="cancel"
                        onClick={() => removeMovieFromList(movie.id)}/>
            </div>
        </div>
    );
}


MyMovieCard.propTypes = {
    movie: propTypes.array.isRequired,
    showDropdown: propTypes.bool.isRequired,
    toggleDropdown: propTypes.func.isRequired,
    removeMovieFromList: propTypes.func.isRequired,
    userLists: propTypes.array.isRequired,
    showAndHideFeedbackMessage: propTypes.func.isRequired,
};

export default MyMovieCard;
