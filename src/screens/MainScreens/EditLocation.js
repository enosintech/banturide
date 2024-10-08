import {Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, Modal, Animated } from "react-native";
import { useState, useCallback, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PanGestureHandler } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import ListLoadingComponent from "../../components/atoms/ListLoadingComponent";
import ModalLoader from "../../components/atoms/ModalLoader";

import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";
import { selectFavAddressChanged, setDeliveryType, setDestination, setFavAddressChanged, setFavAddressUpdated, setFavoritesData, setOrigin, setPassThrough, setPrice, setRecipient, setTravelTimeInformation, setTripDetails } from "../../../slices/navSlice";
import { removeItem } from "../../components/lib/asyncStorage";
import { clearAllNotifications } from "../../../slices/notificationSlice";

const { width } = Dimensions.get("window");

const EditLocation = (props) => {

    const routes = useRoute();

    const { id } = routes.params; 

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const height = Dimensions.get("window").height;

    const tokens = useSelector(selectToken);
    const isSignedIn = useSelector(selectIsSignedIn);
    const favAddressChanged = useSelector(selectFavAddressChanged);

    const [ locationName, setLocationName ] = useState("");
    const [ locationAddress, setLocationAddress ] = useState({
        description: "",
        location: "",
    });

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false); 

    const fontSize = width * 0.05;

    const editLocationForm = {
        address: locationAddress,
        name: locationName,
        locationId: id
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
    
    const handleSaveLocationAddress = async () => {
        setLoading(true)

        await fetch("https://banturide-api.onrender.com/favorites/update-favorite", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens?.idToken}`,
                'x-refresh-token' : tokens?.refreshToken,
            },
            body: JSON.stringify(editLocationForm)
        })
        .then( response => response.json())
        .then(data => {
            if(data.success === false){
                throw new Error(data.message || data.error)
            } else {
                setLoading(false)
                navigation.navigate("Favorite", {saveMessage: `${locationName} Address Edited Successfully`})
                dispatch(setFavAddressUpdated(true));
                setTimeout(() => {
                    dispatch(setFavAddressUpdated(false))
                }, 3000)
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
                setError(errorField || "Failed to edit Favorite location")
                setTimeout(() => {
                    setError(false)
                }, 3000)
            }
        })
    
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0} style={{flex:1}}>
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                >
                    <Animated.View style={{ transform: [{ translateY: translateYClamped }]}} className="flex-1 flex-col justify-end relative">

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
                        
                        <View style={{height: 0.5 * height}} className={`${props.theme === "dark" ? "bg-dark-middle" : "bg-white"} w-full rounded-t-[40px] shadow items-center`}>
                            <View className={`w-full h-[3%] rounded-t-2xl  items-center justify-center`}>
                                <ShortModalNavBar theme={props.theme}/>
                            </View>
                            <View className={`w-full h-[15%] px-3 items-center justify-center flex-row`}>
                                <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>Edit Location</Text>
                            </View>
                            <View className={`w-full h-[40%] pt-2 items-center relative z-20`}>
                                <TextInput
                                    className={`w-[90%] h-[36%] rounded-[25px] font-semibold tracking-tight shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} px-2 `}
                                    placeholder="Name"
                                    style={{fontSize: fontSize * 0.75}}
                                    placeholderTextColor="rgb(156 163 175)"
                                    value={locationName}
                                    onChangeText={(x) => {setLocationName(x)}}
                                    keyboardType={"default"}
                                    autoComplete={"address-line1"}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    accessibilityLabel="Location Name Input"
                                    accessibilityHint="Enter your Favorite Location Name"
                                />
                                <View className={`w-[90%] h-[36%] mt-5 rounded-[25px] shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d]" : "bg-white border-gray-200"}`}>
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
                                                fontSize: fontSize * 0.75,
                                                height: "100%",
                                                width: "100%",
                                                fontWeight: "600",
                                                color: props.theme === "dark" ? "white" : "black",
                                                backgroundColor: "transparent"
                                            },
                                            listView: {
                                                position : "absolute",
                                                zIndex: 100,
                                                elevation: 100,
                                                top: 70,
                                                backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                                borderBottomLeftRadius: 20,
                                                borderBottomRightRadius: 20,
                                                height: 150    
                                            },
                                            row: {
                                                backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                            },
                                            description: {
                                                color: props.theme === "dark" ? "white" : "black"
                                            },
                                        }}
                                        listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme} />}
                                        listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme} />}
                                        textInputProps={{
                                            placeholder: "Enter New Location Address",
                                            placeholderTextColor: "rgb(156 163 175)"
                                        }}
                                        onPress={(data, details = null) => {
                                            setLocationAddress({
                                                ...locationAddress,
                                                location: details.geometry.location,
                                                description: data.description
                                            })
                                        }}
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
                            <View className={`w-[90%] h-[23%] rounded-[20px] ${props.theme === "dark" ? "border-[#222831] bg-dark-secondary" : "bg-white border-gray-200"} shadow border-[0.5px] flex flex-row justify-evenly items-center`}>
                                <TouchableOpacity className={`bg-red-700 shadow-sm w-[40%] h-[65%] rounded-[50px] flex justify-center items-center`} onPress={() => {
                                    navigation.goBack();
                                }}>
                                    <Text style={{fontSize: fontSize * 0.85}} className="font-bold tracking-tight text-white">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={locationAddress["description"].length < 1 ? true : false} className={`bg-[#186F65] shadow-sm w-[40%] h-[65%] rounded-[50px] flex justify-center items-center ${locationAddress["description"].length < 1 ? "opacity-40" : "opacity-100"}`} onPress={handleSaveLocationAddress}>
                                    <Text style={{fontSize: fontSize * 0.85}} className="font-bold tracking-tight text-white">Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default EditLocation;