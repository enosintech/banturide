import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationsArray : [],
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notificationsArray.push(action.payload);
        },
        toggleNotificationStatus: (state, action) => {
            const notification = state.notificationsArray.find(notif => notif.id === action.payload);
            if (notification) {
                notification.status = notification.status === "unread" ? "read" : "unread";
            }
        }
    }
})

export const { addNotification, toggleNotificationStatus } = notificationSlice.actions;

export const selectNotificationsArray = state => state.notifications.notificationsArray;

export default notificationSlice.reducer;