import React, { createContext, useContext, useEffect, useRef } from "react"; 
import { useDispatch, useSelector } from "react-redux";

import { addDriver, setDriver, setBooking } from "../../../slices/navSlice";
import { selectUserInfo } from "../../../slices/authSlice";
import { addNotification, selectNotificationsArray } from "../../../slices/notificationSlice";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {

    const dispatch = useDispatch();
    const socket = useRef(null);

    const userInfo = useSelector(selectUserInfo);
    const notificationsArray = useSelector(selectNotificationsArray);

    useEffect(() => {
        const userId = userInfo?.userId;

        socket.current = new WebSocket(`wss://banturide-api.onrender.com?userId=${encodeURIComponent(userId)}`);

        socket.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        socket.current.onmessage = (message) => {

            const data = JSON.parse(message.data);

            switch (data.type) {
                case "requestReceived":
                    console.log("this is real time data: ", data.message);
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Booking Made",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "bookingCancelled":
                    console.log("this is real time data:" , data.message);
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Booking Cancelled",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "searchStarted":
                    console.log("this is real time data: ", data.message);
                    break;

                case "driverFound":
                    const driver = JSON.parse(data.driver);
                    console.log("driver found", driver);
                    dispatch(addDriver(driver));
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Driver Found",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "driversNotFoundOnTime":
                    console.log("this is real time data:", data.message);
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "No Drivers Found",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "searchComplete":
                    console.log("this is real time data:", data.message);
                    break;

                case "driverAssigned":
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(setDriver(JSON.parse(data.driver)));
                    break;

                case "driverArrived":
                    console.log("this is real time data:", data.message);
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Driver Arrived",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "rideStarted":
                    console.log("this is real time data:", data.message);
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "On The Way",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "rideEnded":
                    console.log("this is real time data:", data.message);
                    dispatch(setBooking(JSON.parse(data.booking)));
                    break;

                case "paymentReceived":
                    console.log("this is real time data:", data.message);
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Ride Complete",
                        content: data.message,
                        status: "unread"
                    }))
                    break;

                case "locationUpdated":
                    console.log("this is real time data:", data.message);
                    dispatch(setBooking(JSON.parse(data.booking)));
                    break;

                case "bookingConfirmed":
                    console.log("This is real time data:", data.message);
                    break;    

                case "message":
                    console.log(`Message received from ${data.senderId}: ${data.content}`);
                    break;

                default:
                    console.log("Unknown message type:", data.type);
                    break;
            }
        };

        socket.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.current.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };

    }, [userInfo])

    return (
        <WebSocketContext.Provider value={socket.current}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(WebSocketContext);