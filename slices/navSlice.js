import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    passThrough: null,
    travelTimeInformation: null,
    toggle: "ride",
    tripDetails: null,
    paymentMethod: "cash",
    price: null,
    seats: "4",
    booking: null,
    tripType: "normal",
    deliveryType: null,
    schoolPickup: false,
    driver: null,
    hasArrived: false,
    onTheWay: false,
    remainingTripTime: 0,
    remainingTripDistance: 0,
    bookingRequestLoading: false,
    favAddressChanged: false,
    favAddressUpdated: false,
    favAddressDeleted: false,
    paymentMethodUpdated: false,
    profileUpdated: false,
    bookingRequested: false, 
    searchPerformed: false,
    searchComplete: false,
    newDriverCalled: false,
    findNewDriver: false,
    globalBookingError: false,
    chatMessages: [],
    favoriteHomeAddress: {
        description: "",
        location: "",
    },
    favoriteWorkAddress: {
        description: "",
        location: "",
    },
    wsClientId: null,
    driverArray: [],
    locationUpdateRan: false,
    recipient : {
        recipientCovers: false,
    },
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
        setPaymentMethod: (state, action ) => {
            state.paymentMethod = action.payload;
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
        setDeliveryType: (state, action) =>{
            state.deliveryType = action.payload;
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
        setFavoriteAddressDeleted: (state, action) => {
            state.favAddressDeleted = action.payload;
        },
        setFavoriteHomeAddress: (state, action) => {
            state.favoriteHomeAddress = action.payload;
        },
        setFindNewDriver: (state, action ) => {
            state.findNewDriver = action.payload;
        },
        setPaymentMethodUpdated : (state, action) => {
            state.paymentMethodUpdated = action.payload;
        },
        setFavoriteWorkAddress: (state, action) => {
            state.favoriteWorkAddress = action.payload;
        },
        setWsClientId: (state, action) => {
            state.wsClientId = action.payload;
        },
        setBookingRequested(state, action) {
            state.bookingRequested = action.payload;
        },
        setSearchPerformed(state, action) {
            state.searchPerformed = action.payload;
        },
        setSearchComplete(state, action){
            state.searchComplete = action.payload;
        },
        setNewDriverCalled(state, action){
            state.newDriverCalled = action.payload;
        },
        setLocationUpdatedRan: (state, action) => {
            state.locationUpdateRan = action.payload;
        },
        setRemainingTripTime: (state, action) => {
            state.remainingTripTime = action.payload;
        },
        setRemainingTripDistance: (state, action) => {
            state.remainingTripDistance = action.payload;
        },
        setGlobalBookingError: (state, action) => {
            state.globalBookingError = action.payload;
        },
        resetSearch(state) {
            state.searchPerformed = false;
        },
        setDriverArray: (state, action) => {
            state.driverArray = action.payload;
        },
        addChatMessage: (state, action) => {
            state.chatMessages.push(action.payload);
        },
        clearChatMessages: (state, action) => {
            state.chatMessages = []
        },
        addDriver: (state, action) => {
            const newDriver = action.payload;
            const isDriverPresent = state.driverArray.some(driver => driver.driverId === newDriver.driverId);

            if (!isDriverPresent) {
                const driverWithTimer = {
                    ...newDriver,
                    timeRemaining: 25,
                };
                state.driverArray.push(driverWithTimer);
            }
        },
        decrementTime: (state, action) => {
            const { driverId } = action.payload;
            const driver = state.driverArray.find(driver => driver.driverId === driverId);
            if (driver && driver.timeRemaining > 0) {
                driver.timeRemaining -= 1;
            }
        },
        removeDriver: (state, action) => {
            const driverIdToRemove = action.payload;
            state.driverArray = state.driverArray.filter(driver => driver.driverId !== driverIdToRemove);
        },
        setRecipient : (state, action) => {
            state.recipient = action.payload;
        },
    }
})

export const { setOrigin, setDestination, setPassThrough, setTravelTimeInformation, setToggle, setTripDetails, setPrice, setSeats, setBooking, setTripType, setDriver, setSchoolPickup, setOnTheWay, setHasArrived, setBookingRequestLoading, setFavAddressUpdated, setFavoriteAddressDeleted, setFavAddressChanged, setProfileUpdated, setFavoriteHomeAddress, setFavoriteWorkAddress, setWsClientId, addChatMessage, clearChatMessages, addDriver, removeDriver, decrementTime, setPaymentMethod, setBookingRequested, setSearchPerformed, resetSearch, setSearchComplete, setNewDriverCalled, setLocationUpdatedRan, setRemainingTripDistance, setRemainingTripTime, setGlobalBookingError, setDeliveryType, setRecipient, setPaymentMethodUpdated, setDriverArray, setFindNewDriver } = navSlice.actions;

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
export const selectFavAddressDeleted = (state) => state.nav.favAddressDeleted;
export const selectProfileUpdated = (state) => state.nav.profileUpdated;
export const selectFavoriteHomeAddress = (state) => state.nav.favoriteHomeAddress;
export const selectFavoriteWorkAddress = (state) => state.nav.favoriteWorkAddress;
export const selectWsClientId = (state) => state.nav.wsClientId;
export const selectPaymentMethod = (state) => state.nav.paymentMethod;
export const selectLocationUpdatedRan = (state) => state.nav.locationUpdateRan;
export const selectRemainingTripTime = (state) => state.nav.remainingTripTime;
export const selectRemaingTripDistance = (state) => state.nav.remainingTripDistance;
export const selectDeliveryType = (state) => state.nav.deliveryType;
export const selectRecipient = (state) => state.nav.recipient;
export const selectPaymentMethodUpdated = (state) => state.nav.paymentMethodUpdated;
export const selectFindNewDriver = (state) => state.nav.findNewDriver;
export const selectChatMessages = (state) => state.nav.chatMessages;
export const selectGlobalBookingError = (state) => state.nav.globalBookingError;

export default navSlice.reducer;