import {createSlice} from "@reduxjs/toolkit";

const auth = createSlice({
    name: 'auth',
    initialState: {
        isAuth: false,
        token: null,
        userId: null,
        email: null,
        photo: null,
        is_superuser: null,
    },
    reducers: {
        login(state, action) {
            console.log(state);
            console.log(action);
            state.isAuth = true;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            state.photo = action.payload.photo;
            state.is_superuser = action.payload.is_superuser;
        },
        logout(state) {
            state.isAuth = false;
            state.token = null;
            state.userId = null;
            state.email = null;
            state.photo = null;
            state.is_superuser = null;
        },
    },
});

export default auth;