import Comment from "./Comment";
import PropTypes from 'prop-types';
import api from "../utils/api";
import { useEffect, useState } from "react";

const CommentList = ({id, refresh, onCommentDelete}) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get('/comments/' + id);
                const reversedComments = response.data.reverse();
                setComments(reversedComments);
            } catch(error) {
                console.error("Errore durante il recupero dei commenti: "+error)
            }

        };
        fetchComments();
    }, [refresh]);

    if (comments.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <div className="rounded-lg bg-sky-100 shadow-2xl p-4 text-center">
                    <p className="text-base">No comments for this list.</p>
                </div>
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