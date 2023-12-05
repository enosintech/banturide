import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: false,
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    passwordConfirm: null,
    gender: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setPasswordConfirm: (state, action) => {
            state.passwordConfirm = action.payload;
        },
        setGender: (state, action) => {
            state.gender = action.payload;
        },
    }
})

export const { setUser, setFirstName, setLastName, setEmail, setPassword, setPasswordConfirm, setGender } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectFirstName = (state) => state.auth.firstName;
export const selectLastName = (state) => state.auth.lastName;
export const selectEmail = (state) => state.auth.email;
export const selectPassword = (state) => state.auth.password;
export const selectPasswordConfirm = (state) => state.auth.passwordConfirm;
export const selectGender = (state) => state.auth.gender;

export default authSlice.reducer;