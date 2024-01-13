import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    show: false,
    text_title: null,
    text_msg: null,
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
            for (let i in initialState){
                state[i] = initialState[i];
            }

            for (let i in action.payload){
                state[i] = action.payload[i];
            }
        },
    },
});

export default popupState;