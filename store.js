import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./slices/navSlice.js";
import authReducer from "./slices/authSlice.js";

export const store = configureStore({
    reducer: {
        nav: navReducer,
        auth: authReducer
    }
});