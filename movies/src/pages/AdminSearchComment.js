import api from "../utils/api";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminRowComment from "../components/AdminRowComment";
import Cookies from "js-cookie";
import AdminRowMovie from "../components/AdminRowMovie";

const AdminSearchComment = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [comments, setComments] = useState([]);
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const refSearch = useRef();
    const onchangeSearch = () => {
        setSearch(refSearch.current.value);
    };

    const token = Cookies.get("access-token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    useEffect(() => {
        console.log("Faccio partire la ricerca");

        api.get('/all_comments', config).then((response) => {

            dispatch({
                type: "hiddenState/clear",
                payload:
                    {
                        table: "comment",
                    }
            });

            const tempComments = response.data.map((comment) => {
                if (comment.comment.toLowerCase().includes(search.toLowerCase())) {
                    return <AdminRowComment comment={comment} key={comment.id}/>
                } else {
                    return <div key={comment.id}></div>;
                }
            });
            setComments(tempComments);

        }).catch((error) => {
            console.log(error);
        });

    }, [search]);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all comments</h1>
            <div className="h-4"/>

            <input type="text" ref={refSearch} onChange={onchangeSearch}
                   className="border-2 border-gray-300 rounded-md w-64 p-2"/>
            <div className="h-5"/>

            {comments.length == 0 &&
                <p className="text-3xl font-normal">
                    No comment found
                </p>
            }
            <div className="max-h-[650px] overflow-y-scroll">
                {comments}
            </div>
        </div>
    );
}

export default AdminSearchComment;