import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";
import popup from "./popup";
import hide from "./hide";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        popup: popup.reducer,
        hide: hide.reducer,
    },
});

export {store};
export const {login, logout} = auth.actions;