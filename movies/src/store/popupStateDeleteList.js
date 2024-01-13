const popupStateDeleteList = (list_id, list_title) => {

    let payload = {
        show: true,
        text_title: "Delete?",
        text_msg: "Do you want to delete '" + list_title + "'?",
        text_yes: "Delete",
        text_no: "Close Popup",
        click_yes: {
            url: "/all_lists/" + list_id,
            method: "delete",
            hide_table: 'list',
            hide_id: list_id,
        },
    };

    return {
        type: "popupState/reset",
        payload: payload
    };
};

export default popupStateDeleteList;