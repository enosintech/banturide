import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
    },
    isSignedIn: false,
    token: null,
    userInfo: null,
    tokenFetched: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setIsSignedIn: (state, action) => {
            state.isSignedIn = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userData = action.payload;
        },
        setTokenFetched: (state, action) => {
            state.tokenFetched = action.payload;
        }
    }
})

export const { setUser, setIsSignedIn, setToken, setUserInfo, setTokenFetched } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsSignedIn = (state) => state.auth.isSignedIn;
export const selectToken = (state) => state.auth.token;
export const selectUserInfo = (state) => state.auth.userData;
export const selectTokenFetched = (state) => state.auth.tokenFetched;

export default authSlice.reducer;