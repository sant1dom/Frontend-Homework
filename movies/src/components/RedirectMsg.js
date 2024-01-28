import {useDispatch, useSelector} from "react-redux";
import redirectMsgDispatch from "../store/redirectMsgDispatch";
import React from "react";
import Button from "./Button";
import Modal from "./Modal";

const RedirectMsg = () => {
	const dispatch = useDispatch();
	const redirectMsgState = useSelector((state) => state.redirectMsgState);

	const handleOk = () => {
		dispatch(redirectMsgDispatch());
	};

	return (
		redirectMsgState.show &&
		<>
			<Modal
				title={redirectMsgState.text_title}
				onClose={handleOk}
				body={
					<>
						<p className="text-2xl">
							{redirectMsgState.text_msg}
						</p>
						<br/>

						<Button
							onClick={handleOk}
							//rounded={true}
							label="Ok"
							variant={'cancel'}
							classes={"bg-gray-200 text-black rounded-full py-1 px-2 hover:bg-gray-300"}
						/>
					</>
				}
			/>
		</>
	);
}

export default RedirectMsg;