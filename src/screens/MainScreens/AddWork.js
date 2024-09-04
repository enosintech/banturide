import {Text, View, TouchableOpacity, Dimensions, Modal, Animated } from "react-native";
import {  useState, useRef, useCallback } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import ModalLoader from "../../components/atoms/ModalLoader";
import ListLoadingComponent from "../../components/atoms/ListLoadingComponent";

import { setFavAddressUpdated, selectFavAddressChanged, setFavAddressChanged, setDestination, setOrigin, setPassThrough, setPrice, setTravelTimeInformation, setTripDetails, setDeliveryType, setRecipient, setFavoritesData } from "../../../slices/navSlice";
import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";
import { removeItem } from "../../components/lib/asyncStorage";
import { clearAllNotifications } from "../../../slices/notificationSlice";

const { width } = Dimensions.get("window");

const AddWork = (props) => {

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const tokens = useSelector(selectToken);
    const isSignedIn = useSelector(selectIsSignedIn);
    const favAddressChanged = useSelector(selectFavAddressChanged);

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ workAddress, setWorkAddress ] = useState({
        description: "",
        location: "",
    })

    const fontSize = width * 0.05;

    const height = Dimensions.get("window").height;

    const addWorkForm = {
        type: "work",
        address: workAddress,
        name: "Work"
    }

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
   
    const handleSaveWorkAddress = async () => {
        setLoading(true)

        await fetch("https://banturide-api.onrender.com/favorites/add-favorite", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens?.idToken}`,
                'x-refresh-token' : tokens?.refreshToken,
            },
            body: JSON.stringify(addWorkForm)
        })
        .then( response => response.json())
        .then( data => {
            if(data.success === false){
                throw new Error(data.message || data.error)
            } else {
                setLoading(false)
                navigation.navigate("Favorite", {saveMessage: "Work Address Added Successfully"})
                dispatch(setFavAddressUpdated(true))
                setTimeout(() => {
                    dispatch(setFavAddressUpdated(false))
                }, 4000)
                dispatch(setFavAddressChanged(!favAddressChanged))
            }
        })
        .catch( async (error) => {

            const errorField = error.message || error.error; 

            if(errorField === "Unauthorized"){
                await SecureStore.deleteItemAsync("tokens")
                .then( async () => {
                    await removeItem("userInfo")
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
                        dispatch(clearAllNotifications())
                        dispatch(setTokenFetched(false))
                        dispatch(setUserDataFetched(false))
                        dispatch(setFavoritesData([]))
                        dispatch(setUserDataSet(false))
                        dispatch(setGlobalUnauthorizedError("Please Sign in Again"))
                        setTimeout(() => {
                            dispatch(setGlobalUnauthorizedError(false))
                        }, 5000)
                    })
                })
                .catch((error) => {
                    setLoading(false)
                    setError("Unauthorized")
                    setTimeout(() => {
                        setError(false)
                    }, 3000)
                })
            } else {
                setLoading(false)
                setError(errorField || "Error adding Work Address")
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
            <Animated.View style={{ transform: [{ translateY: translateYClamped }]}} className="flex-1 flex-col justify-end">

                <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
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
                        <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                            <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof error === "string" ? error : "Server or Network Error Occurred"}</Text>
                        </View>
                    </View>
                }

                <View style={{ height: 0.3 * height }} className={`${props.theme === "dark" ? "bg-dark-middle" : "bg-white"} w-full rounded-t-[40px] shadow items-center`}>
                    <View className={`w-full h-[7%] ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                        <ShortModalNavBar theme={props.theme}/>
                    </View>
                    <View className={`w-full h-[20%] px-3 items-center justify-center flex-row`}>
                        <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}> Add Work</Text>
                    </View>
                    <View className={`w-full h-[30%] items-center justify-center relative z-20`}>
                    <View className={`w-[90%] h-[75%] rounded-[25px] shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d]" : "bg-white border-gray-200"}`}>
                            <GooglePlacesAutocomplete 
                                styles={{
                                    container: {
                                        width: "100%",
                                        height: "100%",
                                    },
                                    textInputContainer: {
                                        height: "100%",
                                        width: "100%",
                                    },
                                    textInput: {
                                        fontSize: fontSize * 0.85,
                                        height: "100%",
                                        width: "100%",
                                        fontWeight: "500",
                                        color: props.theme === "dark" ? "white" : "black",
                                        backgroundColor: "transparent"
                                    },
                                    listView: {
                                        position : "absolute",
                                        zIndex: 100,
                                        elevation: 100,
                                        top: 60,
                                        backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                        borderBottomLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                        height: 100,    
                                    },
                                    row: {
                                        backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                    },
                                    description: {
                                        color: props.theme === "dark" ? "white" : "black"
                                    },
                                }}
                                textInputProps={{
                                    placeholder: "Enter Work Address",
                                    placeholderTextColor: "gray"
                                }}
                                onPress={(data, details = null) => {
                                    setWorkAddress({
                                        ...workAddress,
                                        location: details.geometry.location,
                                        description: data.description
                                    })
                                }}
                                listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme}/>}
                                listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme}/>}
                                query={{
                                    key: api,
                                    language: "en",
                                    components: "country:zm"
                                }}
                                fetchDetails={true}
                                enablePoweredByContainer={false}
                                minLength={1}
                                nearbyPlacesAPI="GooglePlacesSearch"
                                debounce={100}
                            />
                        </View>
                    </View>
                    <View className={`w-[90%] h-[30%] rounded-[20px] ${props.theme === "dark" ? "border-[#222831] bg-dark-secondary" : "bg-white border-gray-200"} shadow border-[0.5px] justify-center items-center`}>
                        <TouchableOpacity disabled={workAddress.description === "" ? true : false } onPress={handleSaveWorkAddress} className={`bg-[#186F65] shadow-lg w-[90%] h-[65%] rounded-[50px] flex justify-center items-center ${workAddress.description === "" ? "opacity-30" : "opacity-100"}`}>
                            <Text style={{fontSize: fontSize * 0.85 }} className="font-bold tracking-tight text-white">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </PanGestureHandler>
    )
}

export default AddWork;