import {configureStore} from "@reduxjs/toolkit";
import auth from "./auth";
import popup from "./popup";

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        popup: popup.reducer,
    },

    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['popup/overwrite', 'overwrite'],
      },
    }),
});

export {store};
export const {login, logout} = auth.actions;