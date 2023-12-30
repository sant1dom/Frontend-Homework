import {configureStore, createSlice} from "@reduxjs/toolkit";

const auth = createSlice({
    name: 'auth',
    initialState: {
        isAuth: false,
        token: null,
        userId: null,
        name: null,
        email: null,
        photo: null,
    },
    reducers: {
        login(state, action) {
            state.isAuth = true;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            state.photo = action.payload.photo;
        },
        logout(state) {
            state.isAuth = false;
            state.token = null;
            state.userId = null;
            state.email = null;
            state.photo = null;
        },
    },
});

export default auth;