import { useEffect, useState } from 'react';
import api from "../utils/api";
import parse from "html-react-parser";

const Comment = ({ content }) => {
    const [author, setAuthor] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchAuthor = async () => {
            api.get('/users/' + content.user_id).then((response) => {
                setAuthor(response.data.email);
                setAvatar(process.env.REACT_APP_BASE_URL + "/" + response.data.image);
            });
        };
        fetchAuthor();
    }, []);

    const lastDate = new Date(content.updated_at);
    const currentDate = new Date();
    const millisecondsPeriod = currentDate - lastDate;
    const daysPeriod = Math.floor(millisecondsPeriod / (24 * 60 * 60 * 1000));

    return(
        <>
            <div className="container px-0 mx-auto sm:px-5 mb-5 w-2/3">
                <div className="flex-col w-full py-4 mx-auto bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg md:w-2/3 shadow-2xl">
                    <div className="flex flex-row">
                        <img className="object-cover w-12 h-12 border-2 border-gray-300 rounded-full"
                            src={avatar}/>
                        <div className="flex-col mt-1">
                            <div className="flex items-center flex-1 px-4 font-bold leading-tight">
                                {author}
                                <span className="ml-2 text-xs font-normal text-gray-500">{daysPeriod} days ago</span>
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