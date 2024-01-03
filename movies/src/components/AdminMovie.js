import {Link} from "react-router-dom";

const AdminMovie = ({movie}) => {

    const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

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
                    <button onClick="openConfirmationPopup({film.id}, '{title}')">
                        DELETE
                    </button>
                </p>
            </td>
        </tr>
    )
}

export default AdminMovie;