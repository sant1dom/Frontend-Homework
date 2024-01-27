import propTypes from 'prop-types';
import {FaRegComment} from "react-icons/fa";
import {Link} from "react-router-dom";
import {BiLike} from "react-icons/bi";
import React, {useEffect, useState} from "react";
import api from "../../utils/api";
import Cookies from "js-cookie";

const BestListCard = ({list, collageMovies}) => {

    const [author, setAuthor] = useState('');
    const [avatar, setAvatar] = useState('');
    const token = Cookies.get("access-token");

    useEffect(() => {
        if (token) {
                const fetchAuthor = async () => {
                    api.get('/users/' + list.user_id).then((response) => {
                        setAuthor(response.data.email);
                        setAvatar(process.env.REACT_APP_BASE_URL + response.data.image);
                    });
                };
                fetchAuthor();
            }
    }, []);


    return (<>
            <Link to={`/bestlists/${list.id}`} className="block">
                <div className="grid grid-cols-2 grid-rows-2 w-full h-48">
                    {collageMovies.map((movie) => (
                        <img
                            key={movie.id}
                            src={movie.poster}
                            alt={movie.title}
                            className="collage-image object-cover w-full h-full"
                        />
                    ))}
                </div>
            </Link>
            <div className="pb-2">
                <div className="flex flex-col items-center">
                    <div className="flex pb-2">
                        <img className="object-cover w-8 h-8 border-2 border-gray-300 rounded-full mr-1"
                             src={avatar}/>
                        <span className=''>{author}</span>
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-1">
                            <BiLike size={21}/>
                            <span className=''>{list.likes.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaRegComment size={21}/>
                            <span>{list.comments.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


BestListCard.propTypes = {
    list: propTypes.object.isRequired,
    collageMovies: propTypes.array.isRequired,
};

export default BestListCard;
