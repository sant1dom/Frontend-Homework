const popupStateAdminDeleteMovie = (movie_id, movie_title) => {

    let payload = {
        show: true,
        text_title: "Delete?",
        text_msg: "Do you want to delete '" + movie_title + "'?",
        text_yes: "Delete",
        text_no: "Close Popup",
        click_yes: {
            url: "/movies/" + movie_id,
            method: "delete",
            hide_table: 'movie',
            hide_id: movie_id,
        },
    };

    return {
        type: "popupState/reset",
        payload: payload
    };
};

export default popupStateAdminDeleteMovie;