import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";
import popupState from "./popupState";
import inputState from "./inputState";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        popupState: popupState.reducer,
        inputState: inputState.reducer,
    },
});

export {store};
export const {login, logout, update_profile_image} = auth.actions;