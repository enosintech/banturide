import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { selectUserInfo } from "../../../slices/authSlice";
import { addDriver, decrementTime, removeDriver, setBooking, setSearchComplete } from "../../../slices/navSlice";
import { addNotification } from "../../../slices/notificationSlice";

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const [ socket, setSocket ] = useState(null);
    const [ connected, setConnected ] = useState(false);

    const dispatch = useDispatch();

    const userInfo = useSelector(selectUserInfo);

    useEffect(() => {
        const socketInstance = io('https://banturide-api.onrender.com');

        const userId = userInfo?.userId;
        const userType = "passenger";

        console.log("Connectiong to Socket.io server");

        socketInstance.emit("register", { userId, userType }, (response) => {
            if(response.success) {
                console.log("Registration successful:", response.message);
            } else {
                console.error("Registration failed:", response.message);
            }
        });

        socketInstance.on('connect', () => {
            setConnected(true);
            console.log('Connected to server');
        });

        socketInstance.on("notification", (data) => {
            
            switch(data.type) {
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

                const intervalId = setInterval(() => {
                    dispatch(decrementTime({ driverId: driver?.driverId }));
                }, 1000);

                setTimeout(() => {
                    dispatch(removeDriver(driver?.driverId));
                    clearInterval(intervalId);
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
                dispatch(setSearchComplete(true))
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
                dispatch(setBooking(JSON.parse(data.booking)));
                break;   

            case "arrivedFirstStop":
                dispatch(setBooking(JSON.parse(data.booking)));
                break;      
        
            default:
                console.log("Unknown message type received:", data.type);
                break;
            }
        })

        socketInstance.on("connectionAcknowledged", (data) => {
            if(data.status === "success"){
                console.log("Connected to the server successfully: ", data)
            } else {
                console.log("Error connnecting to the server: ", data.message);
            }
        })
    
        socketInstance.on('disconnect', () => {
            setConnected(false);
            console.log('Disconnected from server');
        });
    
        socketInstance.on('reconnect', () => {
            setConnected(true);
            console.log('Reconnected to server');
        });
    
        socketInstance.on('reconnect_attempt', (attempt) => {
            console.log(`Reconnection attempt ${attempt}`);
        });
    
        socketInstance.on('reconnect_error', (error) => {
            console.log('Reconnection error:', error);
        });

        socketInstance.on('reconnect_failed', () => {
            console.log('Reconnection failed');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.off('connect');
            socketInstance.off("notification");
            socketInstance.off("connectionAcknowledged");
            socketInstance.off('disconnect');
            socketInstance.off('reconnect');
            socketInstance.off('reconnect_attempt');
            socketInstance.off('reconnect_error');
            socketInstance.off('reconnect_failed');
            socketInstance.close();
        };
      
    }, [])

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);