import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    show: false,
    text_title: null,
    text_msg: null,
};

const redirectMsgState = createSlice({
    name: 'redirectMsgState',
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

export default redirectMsgState;