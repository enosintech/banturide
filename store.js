import { configureStore } from "@reduxjs/toolkit";

import navReducer from "./slices/navSlice.js";
import authReducer from "./slices/authSlice.js";
import notificationReducer from "./slices/notificationSlice.js";
import webSocketReducer from "./slices/webSocketSlice.js";

export const store = configureStore({
    reducer: {
        nav: navReducer,
        auth: authReducer,
        notifications: notificationReducer,
        websocket: webSocketReducer,
    }
});