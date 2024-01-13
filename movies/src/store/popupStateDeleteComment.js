const popupStateDeleteComment = (comment_id, comment_title) => {

    let payload = {
        show: true,
        text_title: "Delete?",
        text_msg: "Do you want to delete '" + comment_title + "'?",
        text_yes: "Delete",
        text_no: "Close Popup",
        click_yes: {
            url: "/all_comments/" + comment_id,
            method: "delete",
            hide_table: 'comment',
            hide_id: comment_id,
        },
    };

    return {
        type: "popupState/reset",
        payload: payload
    };
};

export default popupStateDeleteComment;