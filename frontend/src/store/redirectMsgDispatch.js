const redirectMsgDispatch = (text_title = "", text_msg = "") => {
    let payload = {};

    if (text_title.length > 0 || text_msg.length > 0) {
        payload = {
            show: true,
            text_title: text_title,
            text_msg: text_msg,
        };
    }

    return {
        type: "redirectMsgState/reset",
        payload: payload
    };
};

export default redirectMsgDispatch;