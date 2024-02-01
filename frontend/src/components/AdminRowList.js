import Button from "./Button";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import api from "../utils/api";
import {BiLike} from "react-icons/bi";
import {FaRegComment} from "react-icons/fa";
import {createPortal} from "react-dom";
import Modal from "./Modal";

const AdminRowList = ({list}) => {
	const [showItem, setShowItem] = useState(true);
	const [showPopupDelete, setshowPopupDelete] = useState(false);

	const [author, setAuthor] = useState('');
	const [avatar, setAvatar] = useState('');

	const title = list.name.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

	const token = Cookies.get("access-token");
	const config = {
		headers: {
			'Authorization': `Bearer ${token}`,
		}
	};

	const executeDelete = async (list) => {
		if (token) {
			try {
				await api.delete('/all_lists/' + list.id, config);
				setShowItem(false);
				setshowPopupDelete(true);
			} catch (error) {
				console.log(error);
				return [];
			}
		}
		return [];
	};

	const deletePopupButtons =
		<div>
			<p className="text-2xl">
				Do you want to delete {title}?
			</p>
			<br/>
			<Button onClick={() => setshowPopupDelete(false)} variant={'cancel'}
			        classes={"bg-gray-200 text-black rounded-full py-1 px-2 hover:bg-gray-300"} label={"Cancel"}/>
			<Button onClick={() => executeDelete(list)}
			        classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-red-600 ml-2"} label={"Delete"}/>
		</div>;

	return (
		showItem &&
		<div className="mb-3 bg-white w-screen-sm mx-auto border-1 rounded-xl p-2 max-w-fit shadow-md">

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
						     src={list.avatar}/>
						<span className='float-left'>{list.author}</span>
					</div>
				</div>
			</div>

			<div className="inline-flex">
				<Button
					onClick={() => setshowPopupDelete(true)}
					rounded={true}
					label="Delete"
					classes={"bg-red-500 hover:bg-red-600 ml-2"}
				/>
			</div>
			{showPopupDelete &&
				createPortal(
					<Modal
						onClose={() => setshowPopupDelete(false)}
						title={"Delete?"}
						body={deletePopupButtons}/>,
					document.body
				)
			}
		</div>
	)
}

export default AdminRowList;