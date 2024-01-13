import api from "../utils/api";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import AdminRowComment from "../components/AdminRowComment";
import Cookies from "js-cookie";

const AdminSearchComment = () => {

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);
    const [comments, setComments] = useState([]);
    const dispatch = useDispatch();

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
                return <AdminRowComment comment={comment} key={comment.id}/>
            });
            setComments(tempComments);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all comments</h1>
            <div className="h-4"/>

            <div>
                {comments}
            </div>

        </div>
    );
}

export default AdminSearchComment;