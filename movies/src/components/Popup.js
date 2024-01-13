import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api";
import popupStateMsg from "../store/popupStateMsg";
import React, {useEffect} from "react";
import Button from "./Button";
import Modal from "./Modal";

const Popup = () => {

    const dispatch = useDispatch();
    const popupState = useSelector((state) => state.popupState);

    const handleYes = () => {
        const url = popupState.click_yes.url;
        const method = popupState.click_yes.method;
        const hide_table = popupState.click_yes.hide_table;
        const hide_id = popupState.click_yes.hide_id;

        if (url != null) {
            api[method](url)
                .then(response => {
                    dispatch({
                        type: "hiddenState/add",
                        payload:
                            {
                                table: hide_table,
                                key: hide_id,
                                value: hide_id,
                            }
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation: ', error);
                });
        }

        dispatch(popupStateMsg());
    };

    const handleNo = () => {
        const url = popupState.click_no.url;
        const method = popupState.click_no.method;
        const hide = popupState.click_no.hide;

        if (url != null) {
            api[method](url)
                .then(response => {
                    console.log('Operation completed. Method: ' + method + " - Url: " + url);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation: ', error);
                });
        }

        dispatch(popupStateMsg());
    };

    return (
        <>
            {popupState.show && (
                <Modal
                    title={popupState.text_title}
                    onClose={handleNo}
                    body={
                        <>
                            <p className="text-2xl">
                                {popupState.text_msg}
                            </p>
                            <br />
                            {
                                popupState.text_no &&
                                <Button
                                    onClick={handleNo}
                                    rounded={true}
                                    label={popupState.text_no}
                                    classes={"mr-2 ml-2 bg-gray-500 hover:bg-gray-600"}
                                />
                            }
                            {
                                popupState.text_yes &&
                                <Button
                                    onClick={handleYes}
                                    rounded={true}
                                    label={popupState.text_yes}
                                    classes={"mr-2 ml-2 bg-red-500 hover:bg-red-600"}
                                />
                            }
                        </>
                    }
                />
            )
            }
        </>
    )
}

export default Popup;