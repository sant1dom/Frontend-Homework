import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {store} from "../store/store";
import api from "../utils/api";

const AdminMovie = ({movie}) => {

    const dispatch = useDispatch();
    const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleDeletePopup = () => {
        dispatch({
            type: "popup/overwrite",
            payload:
                {
                    show: true,
                    text_question: "Vuoi cancellare " + title + "?",
                    text_yes: "Cancella",
                    text_no: "Annulla",
                    click_yes: {
                        url: "/movies/" + movie.id,
                        method: "delete",
                    },
                    click_no: {
                        url: null,
                        method: null,
                    },
                }
        });

        console.log('Final state: ', store.getState())
    };

    return (
        <tr id={movie.id}>
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

export default AdminMovie;