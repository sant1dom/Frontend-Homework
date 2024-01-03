import {createSlice} from "@reduxjs/toolkit";

const popup = createSlice({
    name: 'popup',
    initialState: {
        show: false,
        text_question: null,
        text_yes: null,
        text_no: null,
        click_yes: {
            url: null,
            method: null,
            hide: null,
            hide_table: null,
            hide_id: null,
        },
        click_no: {
            url: null,
            method: null,
            hide: null,
            hide_table: null,
            hide_id: null,
        },
    },
    reducers: {
        overwrite(state, action) {
            for (let i in action.payload) {
                state[i] = action.payload[i];
            }
        },
    },
});

export default popup;