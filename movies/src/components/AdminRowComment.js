import {useSelector} from "react-redux";
import Button from "./Button";
import React, {useEffect, useState} from "react";

const AdminRowComment = ({comment}) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        console.log(comment)
    },[]);

    const hidden = useSelector((state) => state.hiddenState.comment);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(comment.id)) {
        return (<></>);
    }

    const handleDeletePopup = () => {
        //dispatch(popupStateAdminDeleteMovie(movie.id, title));
        setShow(true);
    };
    return (
        <div id={`comment_row_${comment.id}`}
             className="mb-3 bg-white w-screen-sm mx-auto border-1 rounded-xl p-2 max-w-fit shadow-md">

            <div className="inline-flex text-left text-lg font-normal w-64 h-30 text-ellipsis"
                 style={{overflow: "hidden"}}>
                <div style={{display: "block"}}>
                    {comment.comment}
                </div>
            </div>

            <div className="inline-flex">
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