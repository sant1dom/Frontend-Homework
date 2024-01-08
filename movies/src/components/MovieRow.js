import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import React from "react";

const MovieRow = ({movie}) => {

    const dispatch = useDispatch();
    const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleDeletePopup = () => {
        console.log("Do you want to delete " + title + "?");

        dispatch({
            type: "popupState/reset",
            payload:
                {
                    show: true,
                    text_msg: "Do you want to delete " + title + "?",
                    text_yes: "Delete",
                    text_no: "Close Popup",
                    click_yes: {
                        url: "/movies/" + movie.id,
                        method: "delete",
                        hide_table: 'movie',
                        hide_id: movie.id,
                    },
                }
        });
    };

    const hidden = useSelector((state) => state.hiddenState.movie);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(movie.id)) {
        return (<></>);
    }

    return (
        <div id={`movie_row_${movie.id}`} className="mb-3 w-screen-sm mx-auto border-2 border-solid border-blue-700 rounded-xl p-2 max-w-fit">

            <div className="inline-flex">
                <ButtonLink
                    rounded={true}
                    key={`/admin/update/${movie.id}`}
                    to={`/admin/update/${movie.id}`}
                    label="Edit"
                />

                <Button
                    onClick={handleDeletePopup}
                    rounded={true}
                    label="Delete"
                    classes={"bg-red-500 hover:bg-red-600 mr-2 ml-2"}
                />

            </div>

            <div className="inline-flex text-left text-lg font-normal w-64" >
                {title}
            </div>

        </div>
    )
}

export default MovieRow;