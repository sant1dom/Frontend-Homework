import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";
import popupState from "./popupState";
import inputState from "./inputState";
import hiddenState from "./hiddenState";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        popupState: popupState.reducer,
        inputState: inputState.reducer,
        hiddenState: hiddenState.reducer,
    },
});

export {store};
export const {login, logout} = auth.actions;