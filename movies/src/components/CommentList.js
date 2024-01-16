import Comment from "./Comment";
import PropTypes from 'prop-types';
import api from "../utils/api";
import { useEffect, useState } from "react";

const CommentList = ({id, refresh}) => {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchComments = async () => {
            api.get('/comments/' + id).then((response) => {
                setComments(response.data);
            });
        };
        fetchComments();
    }, [refresh]);

    return(
        comments.map((comment) => <Comment content={comment}/>)
    )
}

CommentList.propTypes = {id: PropTypes.string.isRequired}

export default CommentList;