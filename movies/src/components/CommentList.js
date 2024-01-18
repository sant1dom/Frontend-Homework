import Comment from "./Comment";
import PropTypes from 'prop-types';
import api from "../utils/api";
import { useEffect, useState } from "react";

const CommentList = ({id, refresh, onCommentDelete}) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const response = await api.get('/comments/' + id);
            const reversedComments = response.data.reverse();
            setComments(reversedComments);
        };
        fetchComments();
    }, [refresh]);

    if (comments.length === 0) {
        return (
            <div className=" rounded-lg bg-sky-100 shadow-2xl p-4 text-center mx-96 gap-8 mb-5">
                <p>No comments for this list.</p>
            </div>
        );
    }

    return(
        <div className="max-h-[500px] overflow-y-scroll no-scrollbar">
            {comments.map((comment) => <Comment key={comment.id} content={comment} onCommentDelete={onCommentDelete}/>)}
        </div>
    )
}

CommentList.propTypes = {id: PropTypes.string.isRequired}

export default CommentList;