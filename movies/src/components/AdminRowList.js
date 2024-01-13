import {useDispatch, useSelector} from "react-redux";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import React from "react";
import popupStateDeleteList from "../store/popupStateDeleteList";

const AdminRowList = ({list}) => {

    const dispatch = useDispatch();

    const title = list.name.replace(new RegExp('"', 'g'), "&quot;").replace(new RegExp("'", 'g'), "’");

    const handleEditPopup = () => {
        console.log("Permettere all'admin di modificare le liste altrui?");
    };

    const handleDeletePopup = () => {
        dispatch(popupStateDeleteList(list.id, title));
    };

    const hidden = useSelector((state) => state.hiddenState.list);
    if (typeof (hidden) != "undefined" && hidden.hasOwnProperty(list.id)) {
        return (<></>);
    }

    return (
        <div id={`list_row_${list.id}`}
             className="mb-3 w-screen-sm mx-auto border-2 border-solid border-blue-700 rounded-xl p-2 max-w-fit">

            <div className="inline-flex text-left text-lg font-normal w-64 h-16 text-ellipsis"
                 style={{overflow: "hidden"}}>
                <div style={{display: "block"}}>
                    {title}
                    <br/> {list.movies.length} movies - {list.comments.length} comments - {list.likes.length} likes
                </div>
            </div>

            <div className="inline-flex">
                {false &&
                    <Button
                        onClick={handleEditPopup}
                        rounded={true}
                        label="Edit"
                        classes={""}
                    />}

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

export default AdminRowList;