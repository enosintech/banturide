import React, { createContext, useContext, useEffect, useRef } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { addDriver, setDriver, setBooking, decrementTime, removeDriver } from "../../../slices/navSlice";
import { selectUserInfo } from "../../../slices/authSlice";
import { addNotification } from "../../../slices/notificationSlice";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const dispatch = useDispatch();
    const socket = useRef(null);
    const retries = useRef(0);
    const isConnecting = useRef(false); // Track connection status

    const userInfo = useSelector(selectUserInfo);

    const connectWebSocket = (userInfoParam) => {
        if (socket.current && socket.current.readyState !== WebSocket.CLOSED) {
            return; // Avoid creating a new connection if one already exists
        }

        if (isConnecting.current) {
            return; // Avoid multiple connection attempts
        }

        if(!userInfoParam){
            return;
        }

        isConnecting.current = true;
        const userId = userInfoParam?.userId;
        if (!userId) return;

        socket.current = new WebSocket(`wss://banturide-api.onrender.com?userId=${encodeURIComponent(userId)}`);

        socket.current.onopen = () => {
            console.log('WebSocket connection opened');
            retries.current = 0;
            isConnecting.current = false;
        };

        socket.current.onmessage = (message) => {
            const data = JSON.parse(message.data);
            switch (data.type) {
                case "requestReceived":
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Booking Made",
                        content: data.message,
                        status: "unread"
                    }));
                    break;
            
                case "bookingCancelled":
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Booking Cancelled",
                        content: data.message,
                        status: "unread"
                    }));
                    break;
            
                case "driverFound":
                    const driver = JSON.parse(data.driver);
                    console.log("driver Found in real time")
                    dispatch(addDriver(driver));

                    // Start a countdown timer for the driver
                    const intervalId = setInterval(() => {
                        dispatch(decrementTime({ driverId: driver?.driverId }));
                    }, 1000);

                    // Schedule removal of the driver after 25 seconds
                    setTimeout(() => {
                        dispatch(removeDriver(driver?.driverId));
                        clearInterval(intervalId); // Stop the countdown
                    }, 25000);

                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Driver Found",
                        content: data.message,
                        status: "unread"
                    }));
                    break;
            
                case "driversNotFoundOnTime":
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "No Drivers Found",
                        content: data.message,
                        status: "unread"
                    }));
                    break;
            
                case "driverAssigned":
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(setDriver(JSON.parse(data.driver)));
                    break;
            
                case "driverArrived":
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Driver Arrived",
                        content: data.message,
                        status: "unread"
                    }));
                    break;
            
                case "rideStarted":
                    dispatch(setBooking(JSON.parse(data.booking)));
                    break;
            
                case "rideEnded":
                    dispatch(setBooking(JSON.parse(data.booking)));
                    break;
            
                case "paymentReceived":
                    dispatch(setBooking(JSON.parse(data.booking)));
                    dispatch(addNotification({
                        id: data.notificationId,
                        title: "Ride Complete",
                        content: data.message,
                        status: "unread"
                    }));
                    break;
            
                case "locationUpdated":
                    console.log(data)
                    dispatch(setBooking(JSON.parse(data.booking)));
                    break;   
            
                case "message":
                    console.log(`Message received from ${data.senderId}: ${data.content}`);
                    break;
            
                default:
                    console.log("Unknown message type sent:", data.type);
                    break;
            }
        };

        socket.current.onclose = () => {
            console.log('WebSocket connection closed');
            isConnecting.current = false;
            if (retries.current < 5 && userInfoParam !== null) {
                retries.current += 1;
                console.log(`Reconnection attempt ${retries.current}`);
                setTimeout(function(){
                    connectWebSocket(userInfo)
                }, 1000 * retries.current);
            } else {
                console.log('Maximum reconnection attempts reached. Giving up.');
            }
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            isConnecting.current = false;
        };
    };

    useEffect(() => {
        if (userInfo) {
            connectWebSocket(userInfo);
        } else {
            console.log("User currently Signed out")
        }

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [userInfo]);

    return (
        <WebSocketContext.Provider value={socket.current}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
