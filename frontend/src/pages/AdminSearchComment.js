import api from "../utils/api";
import React, {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import AdminRowComment from "../components/AdminRowComment";

const AdminSearchComment = () => {
    const [comments, setComments] = useState([]);

    const [search, setSearch] = useState('');
    const refSearch = useRef();
    const onchangeSearch = () => {
        setSearch(refSearch.current.value);
    };

    const [refresh, setRefresh] = useState(true)
    const handleCommentDelete = () => {
        setRefresh(!refresh);
    };

    const token = Cookies.get("access-token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/all_comments', config);

                const sl = search.toLowerCase();
                const tempComments = response.data
                    .filter((comment) => {
                        return comment.comment.toLowerCase().includes(sl);
                    })
                    .map((comment) => {
                        return <AdminRowComment key={comment.id} comment={comment}
                                                onCommentDelete={handleCommentDelete}/>
                    });

                setComments(tempComments);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [search, refresh]);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all comments</h1>
            <div className="h-4"/>

            <input type="text" ref={refSearch} onChange={onchangeSearch}
                   className="border-2 border-gray-300 rounded-md w-64 p-2"/>
            <div className="h-5"/>

            {comments.length === 0 &&
                <p className="text-3xl font-normal">
                    No comment found
                    {search !== "" &&
                        <span> for <i>"{search}"</i></span>
                    }
                </p>
            }
            <div className="max-h-[600px] overflow-y-scroll no-scrollbar">
                {comments}
            </div>
        </div>
    );
}

export default AdminSearchComment;