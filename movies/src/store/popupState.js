import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    show: false,
    text_question: null,
    text_yes: null,
    text_no: null,
    click_yes: {
        url: null,
        method: null,
        hide_table: null,
        hide_id: null,
    },
    click_no: {
        url: null,
        method: null,
        hide_table: null,
        hide_id: null,
    },
};

const popupState = createSlice({
    name: 'popupState',
    initialState: initialState,
    reducers: {
        reset(state, action) {
            state = {
                ...initialState,
                ...action.payload,
            }

                console.log(state);
        },
    },
});

export default popupState;