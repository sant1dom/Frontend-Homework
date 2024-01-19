import {useDispatch, useSelector} from "react-redux";
import popupStateDeleteComment from "../store/popupStateDeleteComment";
import Comment from "./Comment";

const AdminRowComment = ({comment}) => {

    const dispatch = useDispatch();

    const title = comment.comment.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleEditPopup = () => {
        console.log("Permettere all'admin di modificare i commenti altrui?");
    };

    const handleDeletePopup = () => {
        alert("CANCELLO!");
        dispatch(popupStateDeleteComment(comment.id, title));
    };

    const hidden = useSelector((state) => state.hiddenState.comment);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(comment.id)) {
        return (<></>);
    }

    return (
        <div id={`comment_row_${comment.id}`}>
            <Comment key={comment.id} content={comment} onCommentDelete={handleDeletePopup}/>
        </div>
    )
}

export default AdminRowComment;