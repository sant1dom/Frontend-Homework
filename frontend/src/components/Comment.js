import React, {useEffect, useState} from 'react';
import api from "../utils/api";
import parse from "html-react-parser";
import Cookies from 'js-cookie';
import {useDispatch, useSelector} from "react-redux";
import Button from './Button';
import {FaEdit, FaTrash} from "react-icons/fa";
import Modal from "./Modal";
import EditorComment from "./EditorComment";
import {createPortal} from "react-dom";
import FeedbackMessage from './FeedbackMessage';

const Comment = ({content, onCommentDelete}) => {
	const [author, setAuthor] = useState('');
	const [avatar, setAvatar] = useState('');
	const [showItem, setShowItem] = useState(true);
	const [showPopupDelete, setshowPopupDelete] = useState(false);
	const [popupVisible, setPopupVisible] = useState(false);
	const [commentText, setCommentText] = useState('');
	const authState = useSelector((state) => state.auth);
	const [feedbackMessage, setFeedbackMessage] = useState('')
    const [showFeedback, setShowFeedback] = useState(false)
	const token = Cookies.get("access-token");
	const config = {
		headers: {
			'Authorization': `Bearer ${token}`,
		}
	};


	useEffect(() => {
		const fetchAuthor = async () => {
			api.get('/users/' + content.user_id).then((response) => {
				setAuthor(response.data.email);
				setAvatar(process.env.REACT_APP_BASE_URL + response.data.image);
			});
		};
		fetchAuthor();
	}, []);

	const formatTimeAgo = (updatedAt) => {
		const lastDate = new Date(updatedAt);
		const currentDate = new Date();
		const millisecondsPeriod = currentDate - lastDate;
		const seconds = Math.floor(millisecondsPeriod / 1000);

		if (seconds < 60) {
			return "few seconds ago";
		} else if (seconds < 3600) {
			const minutes = Math.floor(seconds / 60);
			return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
		} else if (seconds < 86400) {
			const hours = Math.floor(seconds / 3600);
			return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
		} else {
			const days = Math.floor(seconds / 86400);
			return `${days} ${days === 1 ? "day" : "days"} ago`;
		}
	};

	const openPopup = () => {
		setCommentText(content.comment)
		setPopupVisible(true);
	};

	const closePopup = () => {
		setPopupVisible(false);
	};

	const showAndHideFeedbackMessage = (message, duration) => {
        setFeedbackMessage(message);
        setShowFeedback(true);

        setTimeout(() => {
            setShowFeedback(false);
            setFeedbackMessage('');
        }, duration);
    };

	const handleEditComment = async (comment) => {
		if (token) {
			content.comment = comment;
			try {
				await api.put('/comment/' + content.id,
					{
						comment: comment
					},
					{
						headers: {
							'Authorization': `Bearer ${token}`,
						}
					});
			} catch (error) {
				console.error("Errore durante la modifica del commento: " + error)
			}
			closePopup()
		}
		showAndHideFeedbackMessage('Comment correctly edited!', 2000)
	};

	const executeDelete = async (comment) => {
		try {
			if (content.user_id === authState.userId) {
				await api.delete('/comment/' + comment.id, config);
			} else if (authState.is_superuser) {
				await api.delete('/all_comments/' + comment.id, config);
			}
			else {
				return;
			}

			setShowItem(false);
			setshowPopupDelete(true);

			onCommentDelete();
		} catch (error) {
			console.log(error);
			return [];
		}
		return [];
	};

	const deletePopupButtons =
		<div>
			<p className="text-2xl">
				Do you want to delete this comment?
			</p>
			<br/>
			<Button onClick={() => setshowPopupDelete(false)} variant={'cancel'}
			        classes={"bg-gray-200 text-black rounded-full py-1 px-2 hover:bg-gray-300"} label={"Cancel"}/>
			<Button onClick={() => executeDelete(content)}
			        classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-red-600 ml-2"} label={"Delete"}/>
		</div>;

	const popupBody = <div className="container px-0 mx-auto mb-5">
		<EditorComment onSubmit={handleEditComment} label={"Edit Comment"} initialContent={commentText}/>
	</div>


	return (
		showItem &&
		<>
			<div className="container px-0 mx-auto sm:px-5 mb-5 w-3/4 sm:w-1/2">
				<div
					className="flex-col py-4 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg shadow-lg">
					<div className="flex flex-row">
						<div className="text-center">
							<img className="mx-auto object-cover w-12 h-12 border-2 border-gray-300 rounded-full mb-3"
							     src={avatar} alt="Avatar"/>
							<div className="mx-auto flex justify-center">
								{(content.user_id === authState.userId) &&
									<Button label={<FaEdit/>} variant="hover-nobg" size="small"
									        onClick={openPopup}/>
								}
								{((content.user_id === authState.userId) || authState.is_superuser) &&
									<Button label={<FaTrash/>} variant="hover-nobg" size="small"
									        onClick={() => setshowPopupDelete(true)}/>
								}
							</div>
						</div>
						<div className="flex-col mt-1">
							<div className="flex items-center flex-1 px-4 font-bold leading-tight">
								{author}
								<span
									className="ml-2 text-xs font-normal text-gray-500">{formatTimeAgo(content.updated_at)}</span>
							</div>
							<div className="flex-1 px-2 ml-2 font-medium leading-loose text-gray-600 text-left break-words overflow-y-scroll max-h-32 no-scrollbar">
								{parse(content.comment)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{popupVisible && createPortal(
				<Modal
					title="Edit Comment"
					body={popupBody}
					onClose={() => {
						closePopup();
					}}
				/>,
				document.body
			)}
			{showPopupDelete &&
				createPortal(
					<Modal
						onClose={() => setshowPopupDelete(false)}
						title={"Delete?"}
						body={deletePopupButtons}/>,
					document.body
				)
			}
			{showFeedback && createPortal (
                            <FeedbackMessage
                                message={feedbackMessage}
                            />, document.body
            )}
		</>
	)
}

export default Comment;