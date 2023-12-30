import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
    },
});

export {store};
export const {login, logout} = auth.actions;