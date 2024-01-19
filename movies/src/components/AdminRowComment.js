import {useDispatch, useSelector} from "react-redux";
import Comment from "./Comment";

const AdminRowComment = ({comment}) => {

    const hidden = useSelector((state) => state.hiddenState.comment);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(comment.id)) {
        return (<></>);
    }

    return (
        <Comment key={comment.id} content={comment}/>
    )
}

export default AdminRowComment;