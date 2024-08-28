import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
    },
    userCurrentLocation: null,
    isSignedIn: false,
    token: null,
    userInfo: null,
    tokenFetched: false,
    forgotPasswordTriggered: false,
    globalLoginError: null,
    globalAuthLoading: false,
    globalUnauthorizedError: false,
    userDataSet: false,
    userDataFetched: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserCurrentLocation: (state, action) => {
            state.userCurrentLocation = action.payload;
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
        },
        setForgotPasswordTriggered: (state, action) => {
            state.forgotPasswordTriggered = action.payload;
        },
        setGlobalLoginError: (state, action) => {
            state.globalLoginError = action.payload;
        },
        setGlobalAuthLoading: (state, action) => {
            state.globalAuthLoading = action.payload;
        },
        setGlobalUnauthorizedError: (state, action) => {
            state.globalUnauthorizedError = action.payload;
        },
        setUserDataFetched: (state, action) => {
            state.userDataFetched = action.payload;
        },
        setUserDataSet: (state, action) => {
            state.userDataSet = action.payload;
        }
    }
})

export const { setUser, setUserCurrentLocation, setIsSignedIn, setToken, setUserInfo, setTokenFetched, setForgotPasswordTriggered, setGlobalLoginError, setGlobalAuthLoading, setGlobalUnauthorizedError, setUserDataSet, setUserDataFetched } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectUserCurrentLocation = (state) => state.auth.userCurrentLocation;
export const selectIsSignedIn = (state) => state.auth.isSignedIn;
export const selectToken = (state) => state.auth.token;
export const selectUserInfo = (state) => state.auth.userData;
export const selectTokenFetched = (state) => state.auth.tokenFetched;
export const selectForgotPasswordTriggered = (state) => state.auth.forgotPasswordTriggered;
export const selectGlobalLoginError = (state) => state.auth.globalLoginError;
export const selectGlobalAuthLoading = (state) => state.auth.globalAuthLoading;
export const selectGlobalUnauthorizedError = (state) => state.auth.globalUnauthorizedError
export const selectUserDataSet = (state) => state.auth.userDataSet;
export const selectUserDataFetched = (state) => state.auth.userDataFetched;

export default authSlice.reducer;