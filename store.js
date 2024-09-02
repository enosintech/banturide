import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import navReducer from "./slices/navSlice.js";
import authReducer from "./slices/authSlice.js";
import notificationReducer from "./slices/notificationSlice.js";

const persistConfig = {
    key: "nav",
    storage: AsyncStorage,
}

const persistedNavReducer = persistReducer(persistConfig, navReducer);
const persistedNotificationReducer = persistReducer({...persistConfig, key: "notifications"}, notificationReducer);

const store = configureStore({
    reducer: {
        auth: authReducer,
        nav: persistedNavReducer,
        notifications: persistedNotificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
});

const persistor = persistStore(store);

export { store, persistor};