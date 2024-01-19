const popupStateUserDeleteComment = (comment_id, comment_title, function_success = null) => {

    let payload = {
        show: true,
        text_title: "Delete?",
        //text_msg: "Do you want to delete '" + comment_title + "'?",
        text_msg: "Do you want to delete this comment?",
        text_yes: "Delete",
        text_no: "Close Popup",
        click_yes: {
            url: "/comment/" + comment_id,
            method: "delete",
            hide_table: 'comment',
            hide_id: comment_id,
            function_success: function_success,
        },
    };

    return {
        type: "popupState/reset",
        payload: payload
    };
};

export default popupStateUserDeleteComment;