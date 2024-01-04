import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api";

const Popup = () => {

    const dispatch = useDispatch();
    const popupState = useSelector((state) => state.popupState);

    const closePopup = () => {
        dispatch({
            type: "popupState/add",
            payload:
                {
                    show: false,
                }
        });
    };

    const handleYes = () => {
        const url = popupState.click_yes.url;
        const method = popupState.click_yes.method;
        const hide_table = popupState.click_yes.hide_table;
        const hide_id = popupState.click_yes.hide_id;

        if (url != null) {
            api[method](url)
                .then(response => {
                    dispatch({
                        type: "genericState/add",
                        payload:
                            {
                                table: "hidden_" + hide_table,
                                key: hide_id,
                                value: hide_id,
                            }
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation: ', error);
                });
        }

        closePopup();
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

        closePopup();
    };


    return (
        <div style={{display: popupState.show ? 'block' : 'none'}}>
            <h1>{popupState.text_question}</h1>
            <br/>
            <button className="btn btn-warning" onClick={handleNo}>
                {popupState.text_no}
            </button>
            <button className="btn btn-danger" onClick={handleYes}>
                {popupState.text_yes}
            </button>
        </div>
    )
}

export default Popup;