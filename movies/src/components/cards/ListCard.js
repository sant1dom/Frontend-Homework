import propTypes from 'prop-types';
import {FaEdit, FaTrash} from "react-icons/fa";
import Button from "../Button";
import {Link} from "react-router-dom";

const ListCard = ({list, collageMovies, editList, showDeletePopup}) => {


    return (<>
            <Link to={`/mylists/${list.id}`} className="block">
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
                         style={{visibility: list.private ? 'hidden' : 'visible'}}>
                        <Button label={<FaEdit/>} rounded={true}
                                onClick={() => editList(list)} size={'small'}
                                disabled={list.private}
                                variant={list.private ? 'nobg' : 'secondary'}/>
                        <Button label={<FaTrash/>} rounded={true}
                                onClick={() => showDeletePopup(list.id)} size={'small'}
                                disabled={list.private}
                                variant={list.private ? 'nobg' : 'secondary'}/>
                    </div>
                </div>
            </div>
        </>
    );
}


ListCard.propTypes = {
    list: propTypes.object.isRequired,
    collageMovies: propTypes.array.isRequired,
    editList: propTypes.func.isRequired,
    showDeletePopup: propTypes.func.isRequired,
};

export default ListCard;
