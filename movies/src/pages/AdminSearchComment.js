import api from "../utils/api";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import Comment from "../components/Comment";

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
		api.get('/all_comments', config).then((response) => {

			dispatch({
				type: "hiddenState/clear",
				payload:
					{
						table: "comment",
					}
			});

			let tempComments = response.data;
			tempComments = tempComments.filter((comment) => {
				return comment.comment.toLowerCase().includes(search.toLowerCase());
			});
			tempComments = tempComments.map((comment) => {
				return <Comment key={comment.id} content={comment} onCommentDelete={handleCommentDelete}/>
			});
			setComments(tempComments);

		}).catch((error) => {
			console.log(error);
		});

	}, [search, refresh]);

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
					{search != "" &&
						<span> for <i>"{search}"</i></span>
					}
				</p>
			}
			<div className="max-h-[650px] overflow-y-scroll no-scrollbar">
				{comments}
			</div>
		</div>
	);
}

export default AdminSearchComment;