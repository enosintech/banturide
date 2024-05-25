import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
    },
    isSignedIn: false,
    userInfo: null,
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
        setUserInfo: (state, action) => {
            state.userData = action.payload;
        },
    }
})

export const { setUser, setIsSignedIn, setUserInfo } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsSignedIn = (state) => state.auth.isSignedIn;
export const selectUserInfo = (state) => state.auth.userData;

export default authSlice.reducer;