const popupStateMsg = (text_title = "", text_msg = "") => {
    let payload = {};

    if (text_title.length > 0 || text_msg.length > 0) {
        payload = {
            show: true,
            text_title: text_title,
            text_msg: text_msg,
            text_no: "Ok",
        };
    }

    return {
        type: "popupState/reset",
        payload: payload
    };
};

export default popupStateMsg;