import {useDispatch, useSelector} from "react-redux";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import React, {useEffect, useState} from "react";
import popupStateAdminDeleteList from "../store/popupStateAdminDeleteList";
import Cookies from "js-cookie";
import api from "../utils/api";
import {BiLike} from "react-icons/bi";
import {FaRegComment} from "react-icons/fa";

const AdminRowList = ({list}) => {

    const dispatch = useDispatch();
    const [author, setAuthor] = useState('');
    const [avatar, setAvatar] = useState('');

    const title = list.name.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleEditPopup = () => {
        console.log("Permettere all'admin di modificare le liste altrui?");
    };

    const handleDeletePopup = () => {
        dispatch(popupStateAdminDeleteList(list.id, title));
    };

    const token = Cookies.get("access-token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    useEffect(() => {
        api.get('/users/' + list.user_id, config).then((response) => {
            setAuthor(response.data.email);
            setAvatar(process.env.REACT_APP_BASE_URL + "/" + response.data.image);
        });
    });

    const hidden = useSelector((state) => state.hiddenState.list);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(list.id)) {
        return (<></>);
    }

    return (
        <div id={`list_row_${list.id}`}
             className="mb-3 w-screen-sm mx-auto border-2 border-solid border-blue-700 rounded-xl p-2 max-w-fit">

            <div className="inline-flex text-left text-lg font-normal w-64 h-30 text-ellipsis"
                 style={{overflow: "hidden"}}>
                <div style={{display: "block"}}>
                    {title}
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-1">
                            <span>{list.movies.length} movies</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <BiLike size={21}/>
                            <span>{list.likes.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaRegComment size={21}/>
                            <span>{list.comments.length}</span>
                        </div>
                    </div>
                    <div>
                        <img className="object-cover w-8 h-8 border-2 border-gray-300 rounded-full mr-1 float-left"
                             src={avatar}/>
                        <span className='float-left'>{author}</span>
                    </div>
                </div>
            </div>

            <div className="inline-flex">
                {/*
                <Button
                    onClick={handleEditPopup}
                    rounded={true}
                    label="Edit"
                    classes={""}
                />
                */}

                <Button
                    onClick={handleDeletePopup}
                    rounded={true}
                    label="Delete"
                    classes={"bg-red-500 hover:bg-red-600 ml-2"}
                />
            </div>
        </div>
    )
}

export default AdminRowList;