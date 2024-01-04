import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import genericState from "../store/genericState";

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

    const hidden = useSelector((state) => state.genericState.hidden_movie);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(movie.id)) {
        return (<></>);
    }

    return (
        <tr id={`movie_row_${movie.id}`}>
            <td>
                <p>
                    {title}
                </p>
            </td>
            <td>
                <h5>
                    <Link
                        key={`/admin/update/${movie.id}`}
                        to={`/admin/update/${movie.id}`}
                    >
                        EDIT
                    </Link>
                </h5>
            </td>
            <td>
                <button onClick={handleDeletePopup}>
                    DELETE
                </button>
            </td>
        </tr>
    )
}

export default MovieRow;