import {createSlice} from "@reduxjs/toolkit";

const inputState = createSlice({
    name: 'inputState',
    initialState: {},
    reducers: {
        add(state, action) {
            const table = action.payload.table;
            const key = action.payload.key;
            const value = action.payload.value;

            if (state[table] == null) {
                state[table] = {};
            }

            state[table][key] = value;
        },
        remove(state, action) {
            const table = action.payload.table;
            const key = action.payload.key;

            if (state[table] == null) {
                state[table] = {};
            }
            else {
                delete state[table][key];
            }
        },
        clear(state, action) {
            const table = action.payload.table;

            state[table] = {};
        }
    },
});

export default inputState;