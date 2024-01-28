import propTypes from 'prop-types';
import {FaPlus} from "react-icons/fa";
import Button from "../Button";
import Dropdown from "../Dropdown";

const MovieCard = ({showDropdown, toggleDropdown, movie, elements, openCreateListPopup, showAndHideFeedbackMessage}) => {


    return (<>
                <div className="p-4">
                    <div className="mt-2 flex flex-col items-center">
                        <div className="group inline-block relative">
                            <Button label={<FaPlus/>} rounded={true}
                                    onClick={() => toggleDropdown(movie.id)}/>
                            {showDropdown && (
                                <Dropdown movie={movie}
                                          elements={elements}
                                          toggleDropdown={toggleDropdown}
                                          openCreateListPopup={openCreateListPopup}
                                          showAndHideFeedbackMessage={showAndHideFeedbackMessage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </>
    );
}



MovieCard.propTypes = {
    showDropdown: propTypes.bool.isRequired,
    elements: propTypes.array.isRequired,
    movie: propTypes.object.isRequired,
    toggleDropdown: propTypes.func.isRequired,
    openCreateListPopup: propTypes.func.isRequired,
    showAndHideFeedbackMessage: propTypes.func.isRequired
};

export default MovieCard;
