import { createSlice } from '@reduxjs/toolkit';

const websocketSlice = createSlice({
    name: 'websocket',
    initialState: {
        socket: null,
    },
    reducers: {
        setWebSocket: (state, action) => {
            state.socket = action.payload;
        },
        clearWebSocket: (state) => {
            state.socket = null;
        },
    },
});

export const { setWebSocket, clearWebSocket } = websocketSlice.actions;

export default websocketSlice.reducer;