import {useDispatch, useSelector} from "react-redux";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import React from "react";
import popupStateDeleteComment from "../store/popupStateDeleteComment";

const AdminRowComment = ({comment}) => {

    const dispatch = useDispatch();

    const title = comment.name.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleEditPopup = () => {
        alert("TODO");
    };

    const handleDeletePopup = () => {
        dispatch(popupStateDeleteComment(comment.id, title));
    };

    const hidden = useSelector((state) => state.hiddenState.comment);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(comment.id)) {
        return (<></>);
    }

    return (
        <div id={`comment_row_${comment.id}`}
             className="mb-3 w-screen-sm mx-auto border-2 border-solid border-blue-700 rounded-xl p-2 max-w-fit">

            <div className="inline-flex text-left text-lg font-normal w-64 h-16 text-ellipsis"
                 style={{overflow: "hidden"}}>
                <div style={{display: "block"}}>
                    {title}
                </div>
            </div>

            <div className="inline-flex">
                <Button
                    onClick={handleEditPopup}
                    rounded={true}
                    label="Edit"
                    classes={""}
                />

                <Button
                    onClick={handleDeletePopup}
                    rounded={true}
                    label="Delete"
                    classes={"bg-red-500 hover:bg-red-600 ml-2"}
                />
            </div>
        </div>
    )
}

export default AdminRowComment;