import {createSlice} from "@reduxjs/toolkit";

const popup = createSlice({
    name: 'popup',
    initialState: {
        show: false,
        text_question: null,
        text_yes: null,
        text_no: null,
        click_yes: null,
        click_no: null,
    },
    reducers: {
        overwrite(state, action) {
            for (let i in action.payload)
            {
                state[i] = action.payload[i];
            }
        },
    },
});

export default popup;