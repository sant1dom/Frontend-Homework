import {createSlice} from "@reduxjs/toolkit";

const popupState = createSlice({
    name: 'popupState',
    initialState: {
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
    },
    reducers: {
        add(state, action) {
            for (let i in action.payload) {
                state[i] = action.payload[i];
            }
        },
    },
});

export default popupState;