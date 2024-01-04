import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api";
import PopupMsg from "./PopupMsg";
import {useEffect} from "react";

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
        <div>
            <h1>{popupState.text_msg}</h1>
            <br/>
            <button className="popup_button_no" onClick={handleNo}>
                {popupState.text_no}
            </button>
            <button className="popup_button_yes" onClick={handleYes}>
                {popupState.text_yes}
            </button>
        </div>
    )
}

export default Popup;