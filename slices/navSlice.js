import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    passThrough: null,
    travelTimeInformation: null,
    toggle: "ride",
    tripDetails: null,
    price: null,
    seats: "4",
    booking: null,
    tripType: "normal",
    schoolPickup: false,
    driver: null,
    hasArrived: false,
    onTheWay: false,
    bookingRequestLoading: false,
    favAddressChanged: false,
    favAddressUpdated: false,
    profileUpdated: false,
    favoriteHomeAddress: {
        description: "",
        location: "",
    },
    favoriteWorkAddress: {
        description: "",
        location: "",
    },
    wsClientId: null,
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
        setPassThrough : (state, action) => {
            state.passThrough = action.payload;
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
        setSeats : (state, action) => {
            state.seats = action.payload;
        },
        setBooking : (state, action) => {
            state.booking = action.payload;
        },
        setTripType: (state, action) => {
            state.tripType = action.payload;
        },
        setDriver: (state, action) => {
            state.driver = action.payload;
        },
        setSchoolPickup: (state, action) => {
            state.schoolPickup = action.payload;
        },
        setOnTheWay: (state, action) => {
            state.onTheWay = action.payload;
        },
        setHasArrived: (state, action) => {
            state.hasArrived = action.payload;
        },
        setBookingRequestLoading: (state, action) => {
            state.bookingRequestLoading = action.payload;
        },
        setFavAddressChanged: (state, action) => {
            state.favAddressChanged = action.payload;
        },
        setFavAddressUpdated: (state, action) => {
            state.favAddressUpdated = action.payload;
        },
        setProfileUpdated: (state, action) => {
            state.profileUpdated = action.payload;
        },
        setFavoriteHomeAddress: (state, action) => {
            state.favoriteHomeAddress = action.payload;
        },
        setFavoriteWorkAddress: (state, action) => {
            state.favoriteWorkAddress = action.payload;
        },
        setWsClientId: (state, action) => {
            state.wsClientId = action.payload;
        }
    }
})

export const { setOrigin, setDestination, setPassThrough, setTravelTimeInformation, setToggle, setTripDetails, setPrice, setSeats, setBooking, setTripType, setDriver, setSchoolPickup, setOnTheWay, setHasArrived, setBookingRequestLoading, setFavAddressUpdated, setFavAddressChanged, setProfileUpdated, setFavoriteHomeAddress, setFavoriteWorkAddress, setWsClientId } = navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectPassThrough = (state) => state.nav.passThrough;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;
export const selectToggle = (state) => state.nav.toggle;
export const selectTripDetails = (state) => state.nav.tripDetails;
export const selectPrice = (state) => state.nav.price;
export const selectSeats = (state) => state.nav.seats;
export const selectBooking = (state) => state.nav.booking;
export const selectTripType = (state) => state.nav.tripType;
export const selectDriver = (state) => state.nav.driver;
export const selectSchoolPickup = (state) => state.nav.schoolPickup;
export const selectOnTheWay = (state) => state.nav.onTheWay;
export const selectHasArrived = (state) => state.nav.hasArrived;
export const selectBookingRequestLoading = (state) => state.nav.bookingRequestLoading;
export const selectFavAddressUpdated = (state) => state.nav.favAddressUpdated;
export const selectFavAddressChanged = (state) => state.nav.favAddressChanged;
export const selectProfileUpdated = (state) => state.nav.profileUpdated;
export const selectFavoriteHomeAddress = (state) => state.nav.favoriteHomeAddress;
export const selectFavoriteWorkAddress = (state) => state.nav.favoriteWorkAddress;
export const selectWsClientId = (state) => state.nav.wsClientId;

export default navSlice.reducer;