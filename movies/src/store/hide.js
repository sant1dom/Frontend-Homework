import {createSlice} from "@reduxjs/toolkit";

const hide = createSlice({
    name: 'hide',
    initialState: {
        movie: {},
    },
    reducers: {
        add(state, action) {
            const table = action.payload.table;
            const id = action.payload.id;
            state[table][id] = id;
        },
        remove(state, action) {
            const table = action.payload.table;
            const id = action.payload.id;
            delete state[table][id];
        },
    },
});

export default hide;