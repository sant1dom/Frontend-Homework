import {useDispatch, useSelector} from "react-redux";
import Button from "./Button";
import React from "react";
import popupStateAdminDeleteMovie from "../store/popupStateAdminDeleteMovie";
import {Link} from "react-router-dom";

const AdminRowMovie = ({movie}) => {

    const dispatch = useDispatch();
    const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleDeletePopup = () => {
        dispatch(popupStateAdminDeleteMovie(movie.id, title));
    };

    const hidden = useSelector((state) => state.hiddenState.movie);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(movie.id)) {
        return (<></>);
    }

    return (
        <div id={`movie_row_${movie.id}`}
             className="mb-3 w-screen-sm mx-auto border-2 border-solid border-blue-700 rounded-xl p-2 max-w-fit">

            <div className="inline-flex text-left text-lg font-normal w-64 h-16 text-ellipsis"
                 style={{overflow: "hidden"}}>
                <div style={{display: "block"}}>
                    {title}
                </div>
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
        </div>
    )
}

export default AdminRowMovie;