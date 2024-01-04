import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";
import popupState from "./popupState";
import genericState from "./genericState";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        popupState: popupState.reducer,
        genericState: genericState.reducer,
    },
});

export {store};
export const {login, logout} = auth.actions;