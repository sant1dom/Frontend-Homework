import {useDispatch, useSelector} from "react-redux";
import Button from "./Button";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {createPortal} from "react-dom";
import Modal from "./Modal";
import Cookies from "js-cookie";
import api from "../utils/api";

const AdminRowMovie = ({movie}) => {

    const dispatch = useDispatch();
    const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");
    const [show, setShow] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const handleDeletePopup = () => {
        //dispatch(popupStateAdminDeleteMovie(movie.id, title));
        setShow(true);
    };

    const deleteMovie = async (movie) => {
        const token = Cookies.get("access-token");
        if (token) {
            try {
                const response = await api.delete(`/movies/${movie.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setShow(false);
                setIsHidden(true);
            } catch (error) {
                console.log(error);
                return [];
            }
        }
        return [];
    };

    const deletePopupButtons =
        <div>
            <Button onClick={() => setShow(false)} variant={'cancel'}
                    classes={"bg-gray-200 text-black rounded-full py-1 px-2 hover:bg-gray-300"} label={"Cancel"}/>
            <Button onClick={() => deleteMovie(movie)}
                    classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-red-600 ml-2"} label={"Delete"}/>
        </div>;


    const hidden = useSelector((state) => state.hiddenState.movie);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(movie.id)) {
        return (<></>);
    }

    return (
        isHidden ? <></> :
            <div id={`movie_row_${movie.id}`}
                 className="mb-3 bg-white w-screen-sm mx-auto border-1 rounded-xl p-2 max-w-fit shadow-md">

                <div className="inline-flex text-left text-lg font-normal w-64 overflow-scroll no-scrollbar"
                    style={{textOverflow: "clip ellipsis"}}>
                        {title}
                </div>

                <div className="inline-flex">
                    <Link to={`/admin/movie/update/${movie.id}`}>
                        <Button
                            rounded={true}
                            label="Edit"
                        />
                    </Link>

                    <Button
                        onClick={handleDeletePopup}
                        rounded={true}
                        label="Delete"
                        classes={"bg-red-500 hover:bg-red-600 ml-2"}
                    />
                </div>
                {show &&
                    createPortal(
                        <Modal onClose={() => setShow(false)}
                               title={"Are you sure you want to delete this movie?"}
                               body={deletePopupButtons}/>,
                        document.body
                    )
                }
            </div>
    )
}

export default AdminRowMovie;