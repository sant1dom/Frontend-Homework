import Button from "./Button";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {createPortal} from "react-dom";
import Modal from "./Modal";
import Cookies from "js-cookie";
import api from "../utils/api";

const AdminRowMovie = ({movie}) => {
	const [showItem, setShowItem] = useState(true);
	const [showPopupDelete, setshowPopupDelete] = useState(false);

	const title = movie.title.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

	const token = Cookies.get("access-token");
	const config = {
		headers: {
			'Authorization': `Bearer ${token}`,
		}
	};


	const executeDelete = async (movie) => {
		try {
			await api.delete('/movies/' + movie.id, config);
			setShowItem(false);
			setshowPopupDelete(true);
		} catch (error) {
			console.log(error);
			return [];
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
			<Button onClick={() => executeDelete(movie)}
			        classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-red-600 ml-2"} label={"Delete"}/>
		</div>;

	return (
		showItem &&
		<div className="mb-3 bg-white w-screen-sm mx-auto border-1 rounded-xl p-2 max-w-fit shadow-md">

			<div className="inline-flex text-left text-lg font-normal w-64 overflow-scroll no-scrollbar"
			     style={{textOverflow: "clip ellipsis"}}>
				{title}
			</div>

			<div className="inline-flex">
				<Link to={'/admin/movie/update/' + movie.id}>
					<Button
						rounded={true}
						label="Edit"
					/>
				</Link>

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

export default AdminRowMovie;