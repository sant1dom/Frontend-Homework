const PopupMsg = (text_msg) => {
    let payload = {};

    if (text_msg.length > 0) {
        payload = {
            show: true,
            text_msg: text_msg,
            text_no: "Ok",
        };
    }

    return {
        type: "popupState/reset",
        payload: payload
    };
};

export default PopupMsg;