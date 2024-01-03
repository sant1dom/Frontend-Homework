import {useDispatch, useSelector} from "react-redux";
import api from "../utils/api";

const Popup = () => {

    const dispatch = useDispatch();
    const popupState = useSelector((state) => state.popup);

    const closePopup = () => {
        dispatch({
            type: "popup/overwrite",
            payload:
                {
                    show: false,
                }
        });
    };

    const handleYes = () => {
        const url = popupState.click_yes.url;
        const method = popupState.click_yes.method;

        if (url != null) {
            api[method](url)
                .catch(error => {
                    console.error('There was a problem with the fetch operation: ', error);
                });
        }

        closePopup();
    };

    const handleNo = () => {
        const url = popupState.click_no.url;
        const method = popupState.click_no.method;

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