import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api";
import popupStateMsg from "../store/popupStateMsg";
import React, {useEffect} from "react";
import Button from "./Button";
import Modal from "./Modal";
import Cookies from "js-cookie";

const Popup = () => {

    const dispatch = useDispatch();
    const popupState = useSelector((state) => state.popupState);

    const token = Cookies.get("access-token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    };

    const handleYes = () => {
        console.log("Hai premuto YES");

        const url = popupState.click_yes.url;
        const method = popupState.click_yes.method;
        const function_success = popupState.click_yes.function_success;

        if (url != null) {
            api[method](url, config)
                .then(response => {

                    //Questa parte per lo più nella parte user
                    if (function_success != null) {
                        function_success();
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation: ', error);
                });
        }

        dispatch(popupStateMsg());
    };

    const handleNo = () => {
        console.log("Hai premuto NO");

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
                            <br/>
                            {
                                popupState.text_no &&
                                <Button
                                    onClick={handleNo}
                                    //rounded={true}
                                    label={popupState.text_no}
                                    variant={'cancel'}
                                    classes={"bg-gray-200 text-black rounded-full py-1 px-2 hover:bg-gray-300"}
                                />
                            }
                            {
                                popupState.text_yes &&
                                <Button
                                    onClick={handleYes}
                                    //rounded={true}
                                    label={popupState.text_yes}
                                    classes={"bg-red-500 text-white rounded-full py-1 px-2 hover:bg-red-600 ml-2"}
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