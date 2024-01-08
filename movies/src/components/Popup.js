import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api";
import PopupMsg from "./PopupMsg";
import {useEffect} from "react";
import Button from "./Button";

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

        dispatch(PopupMsg(""));
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

        dispatch(PopupMsg(""));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-white bg-opacity-25">
            <div
                className="border-2 border-solid border-blue-700 rounded-xl p-2 max-w-fit rounded-lg shadow-lg relative flex flex-col w-max bg-white outline-none focus:outline-none">
                <h1 className="text-4xl font-bold">
                    {popupState.text_msg}
                </h1>
                <br/>
                {
                    popupState.text_no &&
                    <Button
                        onClick={handleNo}
                        rounded={true}
                        label={popupState.text_no}
                        classes={"mr-2 ml-2"}
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
            </div>
        </div>
    )
}

export default Popup;