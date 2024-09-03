import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationsArray : [],
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notificationsArray.push({
                ...action.payload,
                createdAt: Date.now(),
              });
        },
        toggleNotificationStatus: (state, action) => {
            const notification = state.notificationsArray.find(notif => notif.id === action.payload);
            if (notification) {
                notification.status = notification.status === "unread" ? "read" : "unread";
            }
        },
        clearOldNotifications(state) {
            const now = Date.now();
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            state.notificationsArray = state.notificationsArray.filter(
                notification => now - notification.createdAt <= twoDays 
            );
        },
        clearAllNotifications(state){
            state.notificationsArray = [];
        },
    }
})

export const { addNotification, toggleNotificationStatus, clearOldNotifications, clearAllNotifications } = notificationSlice.actions;

export const selectNotificationsArray = state => state.notifications.notificationsArray;

export default notificationSlice.reducer;