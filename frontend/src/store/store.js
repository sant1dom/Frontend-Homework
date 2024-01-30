import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";
import redirectMsgState from "./redirectMsgState";
import inputState from "./inputState";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        redirectMsgState: redirectMsgState.reducer,
        inputState: inputState.reducer,
    },
});

export {store};
export const {login, logout, update_profile_image} = auth.actions;