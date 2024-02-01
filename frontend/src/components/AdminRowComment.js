import Button from "./Button";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import api from "../utils/api";
import {createPortal} from "react-dom";
import Modal from "./Modal";

const AdminRowComment = ({comment}) => {
	const [showItem, setShowItem] = useState(true);
	const [showPopupDelete, setshowPopupDelete] = useState(false);

	const title = comment.comment.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

	const token = Cookies.get("access-token");
	const config = {
		headers: {
			'Authorization': `Bearer ${token}`,
		}
	};

	const executeDelete = async (comment) => {
		if (token) {
			try {
				await api.delete('/all_comments/' + comment.id, config);
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
			<Button onClick={() => executeDelete(comment)}
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
						List: {comment.listName}
					</div>
					<div>
						<img className="object-cover w-8 h-8 border-2 border-gray-300 rounded-full mr-1 float-left"
						     src={comment.avatar}/>
						<span className='float-left'>{comment.author}</span>
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

export default AdminRowComment;