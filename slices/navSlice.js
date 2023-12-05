import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    travelTimeInformation: null,
    toggle: "ride",
    tripDetails: null,
    price: null,
    booking: false,
}

export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        }, 
        setTravelTimeInformation: (state, action)  => {
            state.travelTimeInformation = action.payload;
        },
        setToggle : (state, action) => {
            state.toggle = action.payload;
        },
        setTripDetails : (state, action) => {
            state.tripDetails = action.payload;
        },
        setPrice : (state, action) => {
            state.price = action.payload;
        },
        setBooking : (state, action) => {
            state.booking = action.payload;
        }
    }
})

export const { setOrigin, setDestination, setTravelTimeInformation, setToggle, setTripDetails, setPrice, setBooking } = navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;
export const selectToggle = (state) => state.nav.toggle;
export const selectTripDetails = (state) => state.nav.tripDetails;
export const selectPrice = (state) => state.nav.price;
export const selectBooking = (state) => state.nav.booking;

export default navSlice.reducer;