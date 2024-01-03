import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../store/store";
import api from "../utils/api";
import hide from "../store/hide";

const MovieRow = ({movie}) => {

    const dispatch = useDispatch();
    const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleDeletePopup = () => {
        dispatch({
            type: "popup/overwrite",
            payload:
                {
                    show: true,
                    text_question: "Do you want to delete " + title + "?",
                    text_yes: "Delete",
                    text_no: "Close Popup",
                    click_yes: {
                        url: "/movies/" + movie.id,
                        method: "delete",
                        hide_table: 'movie',
                        hide_id: movie.id,
                    },
                    click_no: {
                        url: null,
                        method: null,
                        hide: null,
                        hide_table: null,
                        hide_id: null,
                    },
                }
        });
    };

    const hidden = useSelector((state) => state.hide.movie);
    if (hidden.hasOwnProperty(movie.id)) {
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
                <p>
                    <button onClick={handleDeletePopup}>
                        DELETE
                    </button>
                </p>
            </td>
        </tr>
    )
}

export default MovieRow;