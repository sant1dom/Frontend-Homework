import { useEffect, useState } from 'react';
import api from "../utils/api";
import parse from "html-react-parser";
import Cookies from 'js-cookie';
import {useSelector} from "react-redux";
import Button from './Button';
import {FaTrash} from "react-icons/fa";

const Comment = ({ content, onCommentDelete }) => {
    const [author, setAuthor] = useState('');
    const [avatar, setAvatar] = useState('');
    const authState = useSelector((state) => state.auth);
    const token = Cookies.get("access-token");

    useEffect(() => {
        const fetchAuthor = async () => {
            api.get('/users/' + content.user_id).then((response) => {
                setAuthor(response.data.email);
                setAvatar(process.env.REACT_APP_BASE_URL + "/" + response.data.image);
            });
        };
        fetchAuthor();
    }, []);

    const formatTimeAgo = (updatedAt) => {
        const lastDate = new Date(updatedAt);
        const currentDate = new Date();
        const millisecondsPeriod = currentDate - lastDate;
        const seconds = Math.floor(millisecondsPeriod / 1000);
      
        if (seconds < 60) {
          return "few seconds ago";
        } else if (seconds < 3600) {
          const minutes = Math.floor(seconds / 60);
          return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        } else if (seconds < 86400) {
          const hours = Math.floor(seconds / 3600);
          return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        } else {
          const days = Math.floor(seconds / 86400);
          return `${days} ${days === 1 ? "day" : "days"} ago`;
        }
      };      

      const handleDeleteComment = async () => {
        if(token){
            try {
                await api.delete(`/comment/${content.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                onCommentDelete();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };


    return(
        <>
            <div className="container px-0 mx-auto sm:px-5 mb-5 w-2/3">
                <div className="flex-col py-4 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg shadow-2xl">
                    <div className="flex flex-row">
                        <div>
                            <img className="object-cover w-12 h-12 border-2 border-gray-300 rounded-full mb-3"
                                src={avatar} alt="Avatar"/>
                            {content.user_id === authState.userId ? (
                                <Button label={<FaTrash/>} variant="cancel" onClick={handleDeleteComment}/>                              
                            ): null}
                        </div>
                        <div className="flex-col mt-1">
                            <div className="flex items-center flex-1 px-4 font-bold leading-tight">
                                {author}
                                <span className="ml-2 text-xs font-normal text-gray-500">{formatTimeAgo(content.updated_at)}</span>
                            </div>
                            <div className="flex-1 px-2 ml-2 font-medium leading-loose text-gray-600 text-left">
                                {parse(content.comment)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Comment;