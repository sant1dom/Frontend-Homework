import api from "../utils/api";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import AdminRowComment from "../components/AdminRowComment";

const AdminSearchComment = () => {
    const [comments, setComments] = useState([]);

    const [search, setSearch] = useState('');

    const [refresh, setRefresh] = useState(true);

    const handleCommentDelete = () => {
        setRefresh(!refresh);
    };

    const handleSearch = async (term) => {
        setSearch(term);
        const token = Cookies.get("access-token");
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };
        try {
            const response = await api.get('/all_comments', config);
            const sl = search.toLowerCase();
            let tempComments = await Promise.all(response.data
                .map(async (comment) => {
                    const response_author = await api.get('/users/' + comment.user_id, config);
                    const response_list = await api.get('/all_lists/' + comment.movie_list_id, config);
                    comment.author = response_author.data.email;
                    comment.avatar = process.env.REACT_APP_BASE_URL + response_author.data.image;
                    comment.listName = response_list.data.name;
                    return comment;
                }));

            tempComments = tempComments.filter((comment) => {
                return comment.author.toLowerCase().includes(sl) || comment.comment.toLowerCase().includes(sl) || comment.listName.toLowerCase().includes(sl);
            });

            setComments(tempComments);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    useEffect(() => {
        const token = Cookies.get("access-token");
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };

        async function fetchData() {
            try {
                const response = await api.get('/all_comments', config);
                let tempComments = await Promise.all(response.data
                    .map(async (comment) => {
                        const response_author = await api.get('/users/' + comment.user_id, config);
                        const response_list = await api.get('/all_lists/' + comment.movie_list_id, config);
                        comment.author = response_author.data.email;
                        comment.avatar = process.env.REACT_APP_BASE_URL + response_author.data.image;
                        comment.listName = response_list.data.name;
                        return comment;
                    }));
                setComments(tempComments);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="container mx-auto items-center justify-center">

            <div className="h-4"/>
            <h1 className="text-4xl font-bold">View and delete all comments</h1>
            <div className="h-4"/>

            <input type="text"
                   onChange={(e) => handleSearch(e.target.value)}
                   placeholder="Search comment"
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
                {comments.length !== 0 &&
                    <div className="grid grid-cols-1 gap-4">
                        {comments.map((comment) => {
                            return <AdminRowComment key={comment.id} comment={comment}
                                                    onCommentDelete={handleCommentDelete}/>;
                        })}
                    </div>
                }
            </div>
        </div>
    );
}

export default AdminSearchComment;