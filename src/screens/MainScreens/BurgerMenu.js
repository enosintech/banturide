import {Text, View, TouchableOpacity, Dimensions, Modal, Animated } from "react-native";
import { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";

import BurgerMenuItem from "../../components/atoms/BurgerMenuItem.js";
import ShortModalNavBar from "../../components/atoms/ShortModalNavBar.js";
import ModalLoader from "../../components/atoms/ModalLoader.js";

import { selectGlobalAuthLoading, selectIsSignedIn, setGlobalAuthLoading, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice.js";

import { removeItem } from "../../components/lib/asyncStorage.js";
import { setDeliveryType, setDestination, setOrigin, setPassThrough, setPrice, setRecipient, setTravelTimeInformation, setTripDetails } from "../../../slices/navSlice.js";

const { width } = Dimensions.get("window");

const BurgerMenu = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const height = Dimensions.get("window").height;

    const fontSize = width * 0.05;

    const globalAuthLoading = useSelector(selectGlobalAuthLoading);
    const isSignedIn = useSelector(selectIsSignedIn);

    const { goBack } = useNavigation();
    const translateY = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        {
             useNativeDriver: true, 
        },
    )

    const onHandlerStateChange = useCallback(
        ({nativeEvent}) => {
            if (nativeEvent.state === 5) { // 5 is the value for `END` state
                if (nativeEvent.translationY > 150) { // Adjust threshold as needed
                    goBack(); // Close the modal
                } else {
                    Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    }).start();
                }
            }
        },
        [goBack, translateY]
    )

    const translateYClamped = translateY.interpolate({
        inputRange: [0, 9999],  // Large range to allow normal dragging
        outputRange: [0, 9999], // Mirrors input but clamps the lower bound to 0
        extrapolate: 'clamp',
    });

    const handleSignOut = async () => {
        dispatch(setGlobalAuthLoading(true))
        
        await fetch("https://banturide-api.onrender.com/auth/signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then( async (data) => {
            if(data.success === false) {
                throw new Error(data.message || data.error)
            } else {
                await SecureStore.deleteItemAsync("tokens").then( async () => {
                    await removeItem("userInfo").then(() => {
                        dispatch(setUserInfo(null))
                        dispatch(setToken(null))
                        dispatch(setIsSignedIn(!isSignedIn))
                        dispatch(setTokenFetched(false))
                        dispatch(setUserDataFetched(false))
                        dispatch(setUserDataSet(false))
                    })
                })
            }
        })
        .catch( async (error) => {
            const errorField = error.message || error.error;

            if(errorField === "Unauthorized"){
                await SecureStore.deleteItemAsync("tokens")
                .then(() => {
                    dispatch(setDestination(null))
                    dispatch(setOrigin(null))
                    dispatch(setPassThrough(null))
                    dispatch(setPrice(null))
                    dispatch(setTravelTimeInformation(null))
                    dispatch(setTripDetails(null))
                    dispatch(setDeliveryType(null))
                    dispatch(setRecipient(null))
                    dispatch(setUserInfo(null))
                    dispatch(setToken(null))
                    dispatch(setIsSignedIn(!isSignedIn))
                    dispatch(setTokenFetched(false))
                    dispatch(setUserDataFetched(false))
                    dispatch(setUserDataSet(false))
                    dispatch(setGlobalUnauthorizedError("Please Sign in Again"))
                    setTimeout(() => {
                        dispatch(setGlobalUnauthorizedError(false))
                    }, 5000)
                })
                .catch((error) => {
                    dispatch(setGlobalAuthLoading(false))
                    setError("Unauthorized")
                    setTimeout(() => {
                        setError(false)
                    }, 3000)
                })     
            } else {
                dispatch(setGlobalAuthLoading(false))
                setError(errorField || "Error Signing out")
                setTimeout(() => {
                    setError(false)
                }, 4000)
            }
        })
    }
    
    return(
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View style={{height: height, transform: [{ translateY: translateYClamped }]}} className="w-full flex-col justify-end relative">

                <Modal transparent={true} animationType="fade" visible={globalAuthLoading} onRequestClose={() => {
                    if(loading === true){
                        return
                    } else {
                        setLoading(false)
                    }
                }}>
                    <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
                        <ModalLoader theme={props.theme}/>
                    </View>
                </Modal>

                {error &&
                    <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                        <View className={`w-fit px-4 h-[90%] bg-red-600 rounded-[50px] flex items-center justify-center`}>
                            <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-medium text-center tracking-tight">{typeof error === "string" ? error : "Server or Network Error Occurred"}</Text>
                        </View>
                    </View>
                }

                <View className={`h-[30%] relative z-10 w-full ${props.theme === "light" ? "bg-white" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-2xl rounded-t-2xl`}>
                    <View className={`w-full h-[7%] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                        <ShortModalNavBar theme={props.theme}/>
                    </View>
                    <BurgerMenuItem theme={props.theme} iconName="info" text="About" handlePress={() => {
                        navigation.navigate("About")
                    }}/>
                    <TouchableOpacity className={`h-[25%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={handleSignOut}>
                        <MaterialIcons name="logout" size={fontSize * 1.7} color={`${props.theme === "dark" ? "white" : "black"}`} />
                        <Text style={{fontSize: fontSize * 0.8}} className={`font-black tracking-tight ml-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign Out</Text>
                    </TouchableOpacity>
                    <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[20%]`}></View>
                </View>
            </Animated.View>
        </PanGestureHandler>
    )
}

export default BurgerMenu;