import {Text, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, TouchableOpacity, StyleSheet, Dimensions, Platform, Image, Animated } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { PanGestureHandler } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";

import { GOOGLE_API_KEY } from "@env";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import ListLoadingComponent from "../../components/atoms/ListLoadingComponent";

import { setOrigin, setDestination, selectTripType, selectToggle, setSchoolPickup, selectSchoolPickup, selectPassThrough, setPassThrough, selectPaymentMethod, setPaymentMethod, selectDestination, selectOrigin, setTripType, selectDeliveryType, setDeliveryType, selectFavoritesData } from "../../../slices/navSlice";
import { selectUserCurrentLocation, selectUserInfo } from "../../../slices/authSlice";

import { deliveryData } from "../../constants";

const { width } = Dimensions.get("window");

const SearchModal = (props) => {

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const origin = useSelector(selectOrigin);
    const passThrough = useSelector(selectPassThrough);
    const destination = useSelector(selectDestination);
    const tripType = useSelector(selectTripType);
    const toggle = useSelector(selectToggle);
    const schoolPickup = useSelector(selectSchoolPickup);
    const userInfo = useSelector(selectUserInfo);
    const paymentMethod = useSelector(selectPaymentMethod);
    const deliveryType = useSelector(selectDeliveryType);
    const favoritesData = useSelector(selectFavoritesData);

    const height = Dimensions.get("window").height;

    const fontSize = width * 0.05;

    const navigation = useNavigation();

    const dispatch = useDispatch()
    const originRef = useRef();
    const passThroughRef = useRef();
    const destinationRef = useRef();
    const [ greeting, setGreeting ] = useState("");
    const [ selected, setSelected ] = useState(false);
    const [ stopAdded, setStopAdded ] = useState(false);
    const [ paymentVisible, setPaymentVisible ] = useState(false)

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

    const predefinedPlaces = favoritesData.map((place) => ({
        description: place.type === 'home' ? "Home" : place.type === 'work' ? "Work" : place.address.description,
        geometry: { location: place.address.location },
    }));

    const sortedPredefinedPlaces = [...predefinedPlaces].sort((a, b) => {
        if (a.description === "Home") return -1;
        if (b.description === "Home") return 1;
        if (a.description === "Work") return b.description === "Home" ? 1 : -1;
        if (b.description === "Work") return a.description === "Home" ? -1 : 1;
        return 0;
    });
    
    const handleGreeting = () => {
        const hour = new Date().getHours();

        hour < 12 ? setGreeting("Good Morning") : hour < 16 ? setGreeting("Good Afternoon") : hour < 21 ? setGreeting("Good Evening") : setGreeting("Be Safe at Night")
    }

    const handleSwitch = () => {
        dispatch(setPassThrough(destination));
        dispatch(setDestination(passThrough));
    }

    useEffect(() => {
        dispatch(setSchoolPickup(selected));
    }, [selected])

    useEffect(() => {
        handleGreeting()

        const interval = setInterval(handleGreeting, 1200000);

        return () => clearInterval(interval);
    }, [])

    return(
            <KeyboardAvoidingView
                style={containerStyles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                keyboardVerticalOffset={fontSize * 0.45}
            >
            <TouchableWithoutFeedback style={{ backgroundColor: "transparent"}} className="w-full h-full" onPress={Keyboard.dismiss}>
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                    className="bg-transparent"
                >
                    <Animated.View style={{height: toggle === "ride" ? 0.53 * height : 0.6 * height, transform: [{ translateY: translateYClamped }] }} className={`w-full ${props.theme === "dark" ? "bg-dark-primary" : "bg-gray-100"} items-center overflow-hidden rounded-t-[40px]`}>
                        <View className={`h-[3%] w-full items-center justify-center`}>
                            <ShortModalNavBar theme={props.theme} />
                        </View>
                        <View className={`h-[10%] w-full border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} items-center justify-center`}>
                            <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>{greeting + " " + userInfo?.firstname}</Text>
                        </View>
                        <View className={`w-[84.8%] rounded-[50px] p-1 shadow-sm h-[13.5%] mt-2 ${props.theme === "dark" ? "bg-neutral-400" : "bg-white"} flex-row ${toggle !== "ride" ? "hidden" : "flex"}`}>
                            <View className={`w-full rounded-[50px] ${tripType !== "normal" ? props.theme === "dark" ? "" : "bg-white" : "bg-[#406b66]"} h-full flex items-center justify-center`}>
                                <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${tripType !== "normal" ? "text-black" :"text-white"}`}>Single Trip</Text>
                            </View>
                            {/* <TouchableOpacity disabled={true} className={`w-1/2 opacity-20 rounded-[50px] ${tripType !== "normal" ? "bg-[#186f65]" : props.theme === "dark" ? "" : "bg-white"} h-full flex items-center justify-center`} onPress={() => {
                                dispatch(setTripType("allday"))
                                dispatch(setOrigin(null))
                                dispatch(setPassThrough(null))
                                dispatch(setDestination(null));
                                originRef?.current?.clear()
                                passThroughRef?.current?.clear()
                                destinationRef?.current?.clear()
                                setSelected(false)
                                setStopAdded(false)
                            }}>
                                <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${tripType !== "normal" ? "text-white" : "text-black"}`}>All-day Trip</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View className={`w-[85%] h-fit mt-2 rounded-[40px] relative z-10 flex justify-between shadow-sm ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"}`}>
                            <View className={`flex-row items-center justify-center w-full h-[60px] relative z-[60]`}>
                                <View className={`w-[15%] items-center h-full justify-center translate-x-1`}>
                                    <MaterialIcons name="trip-origin" size={fontSize * 1.2} color={`${props.theme === "dark" ? "white" : "black"}`} />
                                </View>
                                <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-800" : "border-gray-300"}`}></View>
                                <GooglePlacesAutocomplete 
                                    ref={originRef}
                                    styles={{
                                        textInputContainer: {
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 20,
                                            backgroundColor: "transparent"
                                        },
                                        textInput: {
                                            fontSize: fontSize * 0.9,
                                            height: "100%",
                                            fontWeight: "bold",
                                            width : "100%",
                                            color: props.theme === "dark" ? "white" : "black",
                                            backgroundColor: "transparent",
                                        },
                                        listView: {
                                            position : "absolute",
                                            zIndex: 100,
                                            elevation: 100,
                                            top: 56,
                                            borderBottomLeftRadius: 20,
                                            borderBottomRightRadius: 20, 
                                            backgroundColor: props.theme === "dark" ? "#222831" : "white",  
                                        },
                                        description: {
                                            color: props.theme === "dark" ? "white" : "black"
                                        },
                                        loader: {
                                            height: "100%",
                                            width: "100%"
                                        },
                                        row: {
                                            backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                        }
                                    }}
                                    textInputProps={{
                                        placeholder: toggle === "ride" ? "Where From?" : "Pick Up?",
                                        placeholderTextColor: "gray",
                                    }}
                                    predefinedPlaces={sortedPredefinedPlaces}
                                    onPress={(data, details = null) => {
                                        dispatch(setOrigin({
                                            location: details.geometry.location,
                                            description: data.description
                                        }))

                                        dispatch(setDestination(null))
                                    }}
                                    query={{
                                        key: api,
                                        language: "en",
                                        components: "country:zm",
                                    }}
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    minLength={2}
                                    nearbyPlacesAPI="GooglePlacesSearch"
                                    debounce={100}
                                    listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme} />}
                                    listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme}/>}
                                />
                            </View>
                            <View className={`w-full h-[35px] items-center justify-center ${tripType === "normal" && !stopAdded ? "flex" : "hidden"}`}>
                                <TouchableOpacity className={`rounded-full w-[25%] h-[90%] items-center justify-center shadow-sm border ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"}`} onPress={() => {
                                    setStopAdded(!stopAdded);
                                }}>
                                    <Text style={{fontSize: fontSize * 0.6}} className={`tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                tripType === "normal"
                                &&
                                <View className={`flex-row items-center justify-center w-full h-[65px] shadow-2xl relative z-50 ${stopAdded === false ? "hidden" : "flex"} `}>
                                    <View className={`w-[15%] items-center h-full justify-center`}>
                                        <TouchableOpacity className={`w-8 h-8 rotate-90 rounded-full shadow border items-center justify-center ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"}`} onPress={handleSwitch}>
                                            <Octicons name="arrow-switch" size={fontSize} color={props.theme === "dark" ? "white" : "black"} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-white" : "border-gray-800"}`}></View>
                                    <View className={`absolute w-[25%] h-full right-0 z-50 flex items-center justify-center`}>
                                        <TouchableOpacity className={`rounded-full w-[85%] -translate-x-1 h-[50%] items-center justify-center shadow border ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"}`} onPress={() => {
                                            setStopAdded(!stopAdded);
                                            dispatch(setPassThrough(null));
                                            passThroughRef?.current.clear();
                                        }}> 
                                            <Text style={{fontSize: fontSize * 0.45}} className={`tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Remove Stop</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <GooglePlacesAutocomplete 
                                        ref={passThroughRef}
                                        styles={{
                                            container: {
                                                width: "100%",
                                                height: "100%",
                                            },
                                            textInputContainer: {
                                                height: "100%",
                                                width: "70%",
                                            },
                                            textInput: {
                                                fontSize: 18,
                                                height: "100%",
                                                width: "100%",
                                                fontWeight: "bold",
                                                color: props.theme === "dark" ? "white" : "black",
                                                backgroundColor: "transparent"
                                            },
                                            listView: {
                                                position : "absolute",
                                                zIndex: 100,
                                                elevation: 100,
                                                top: 56,
                                                borderBottomLeftRadius: 20,
                                                borderBottomRightRadius: 20,
                                                backgroundColor: props.theme === "dark" ? "#222831" : "white",  
                                            },
                                            description: {
                                                color: props.theme === "dark" ? "white" : "black"
                                            },
                                            loader: {
                                                height: "100%",
                                                width: "100%"
                                            },
                                            row: {
                                                backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                            }
                                        }}
                                        textInputProps={{
                                            placeholder: toggle === "ride" ? "Going Through?" : "Pick-Up/ Drop-Off",
                                            placeholderTextColor: "gray",
                                        }}
                                        query={{
                                            key: api,
                                            language: "en",
                                            components: "country:zm"
                                        }}
                                        predefinedPlaces={sortedPredefinedPlaces}
                                        onPress={(data, details = null) => {
                                            dispatch(setPassThrough({
                                                location: details.geometry.location,
                                                description: data.description
                                            }))
                                        }}
                                        fetchDetails={true}
                                        enablePoweredByContainer={false}
                                        minLength={2}
                                        nearbyPlacesAPI="GooglePlacesSearch"
                                        debounce={100}
                                        listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme} />}
                                        listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme}/>}
                                    />
                                </View>
                            }

                            <View className={`flex-row items-center justify-center w-full h-[65px] shadow-2xl relative z-40 ${tripType !== "normal" ? "hidden" : "flex"}`}>
                                <View className={`w-[15%] items-center h-full justify-center translate-x-1`}>
                                    <FontAwesome name="flag-checkered" size={fontSize * 1.2} color={`${props.theme === "dark" ? "white" : "black"}`} />
                                </View>
                                <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-800" : "border-gray-300"}`}></View>
                                <GooglePlacesAutocomplete 
                                    ref={destinationRef}
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
                                            fontSize: fontSize * 0.9,
                                            height: "100%",
                                            width: "100%",
                                            fontWeight: "bold",
                                            color: props.theme === "dark" ? "white" : "black",
                                            backgroundColor: "transparent",
                                        },
                                        listView: {
                                            position : "absolute",
                                            zIndex: 100,
                                            elevation: 100,
                                            top: 56,
                                            borderBottomLeftRadius: 20,
                                            borderBottomRightRadius: 20,
                                            backgroundColor: props.theme === "dark" ? "#222831" : "white",  
                                        },
                                        description: {
                                            color: props.theme === "dark" ? "white" : "black"
                                        },
                                        loader: {
                                            height: "100%",
                                            width: "100%"
                                        },
                                        row: {
                                            backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                        }
                                    }}
                                    textInputProps={{
                                        placeholder: toggle === "ride" ? "Where To?" : "Drop Off",
                                        placeholderTextColor: "gray",
                                    }}
                                    query={{
                                        key: api,
                                        language: "en",
                                        components: "country:zm"
                                    }}
                                    predefinedPlaces={sortedPredefinedPlaces}
                                    onPress={(data, details = null) => {
                                        dispatch(setDestination({
                                            location: details.geometry.location,
                                            description: data.description
                                        }))
                                    }}
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    minLength={2}
                                    nearbyPlacesAPI="GooglePlacesSearch"
                                    debounce={100}
                                    listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme} />}
                                    listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme}/>}
                                />
                            </View>
                        </View>
                        <View className={`${toggle === "ride" ? "hidden" : "flex"} flex-row items-center justify-between mt-2 w-[85%] h-[20%]`}>
                            {deliveryData.map((item, index) => (
                                <TouchableOpacity key={item.id} className={`w-[31.5%] h-[97%] relative ${deliveryType ? deliveryType.title === item.title ? "opacity-100" : "opacity-30" : "opacity-100"} rounded-[30px] ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"} shadow-sm px-2 flex justify-evenly`} onPress={() => {
                                    dispatch(setDeliveryType(item))
                                }}>
                                    <Image 
                                        source={item.image}
                                        style={{
                                            position: "absolute",
                                            top: -1,
                                            left: 8,
                                            objectFit: "contain",
                                            width : 70,
                                            height: 70,
                                            opacity: 0.85
                                        }}
                                    />
                                    <View></View>
                                    <View className="translate-y-2 translate-x-1">
                                        <Text style={{fontSize : fontSize * 0.5}} className={`font-black tracking-tighter ${props.theme === "dark" ? "text-white" : "text-black"}`}>{item.title}</Text>
                                        <Text style={{fontSize : fontSize * 0.4}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{item.description}</Text>
                                        <Text style={{fontSize : fontSize * 0.45}} className={`mt-1 font-bold ${props.theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{item.example}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className={`w-[85%] h-[18%] ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"} ${tripType === "normal" ? "hidden" : "flex"} mt-2 rounded-[40px] `}>

                        </View>
                        <View className={`w-[85%] h-[18%] ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"} mt-2 rounded-[50px] shadow-sm flex relative ${paymentVisible ? "z-20" : "z-5"}`}>
                            <View className={`w-full h-full flex flex-row relative`}>
                            {
                                paymentVisible && 

                                <View className={`w-full h-[100px] ${props.theme === "dark" ? "bg-[#464f5d]" : "bg-white"} shadow-sm absolute bottom-[100%] rounded-[20px] flex flex-col z-[100] px-3`}>
                                    <TouchableOpacity className="w-full h-1/2 flex flex-row items-center" onPress={() => {
                                        dispatch(setPaymentMethod("cash"))
                                        setPaymentVisible(false);
                                    }}>
                                        <Ionicons name="cash" color={"green"} size={fontSize}/>
                                        <Text style={{fontSize: fontSize * 0.7}} className={`ml-2 ${props.theme === "dark" ? "text-white" : "text-black" }`}>Cash</Text>
                                    </TouchableOpacity>
                                    <View className="w-full h-0 border-[0.5px] border-gray-200"></View>
                                    <TouchableOpacity className="w-full h-1/2 flex flex-row items-center" onPress={() => {
                                        dispatch(setPaymentMethod("mobileMoney"))
                                        setPaymentVisible(false);
                                    }}>
                                        <Entypo name="wallet" color={props.theme === "dark" ? "white" : "black"} size={fontSize} />
                                        <Text style={{fontSize: fontSize * 0.7}} className={`ml-2 ${props.theme === "dark" ? "text-white" : "text-black" }`}>Mobile Money</Text>
                                    </TouchableOpacity>
                                </View>

                            }

                                <TouchableOpacity className={`w-[18%] h-full flex items-center justify-center translate-x-1`} onPress={() => setPaymentVisible(!paymentVisible)}>
                                    {paymentMethod === "cash" ? 
                                        <Ionicons name="cash" size={fontSize * 1.4} color="green" />
                                    :
                                        <Entypo name="wallet" color={props.theme === "dark" ? "white" : "black"} size={fontSize * 1.4} />
                                    }
                                </TouchableOpacity>
                                <View className={`w-[82%] h-full flex items-center justify-center`}>
                                    <TouchableOpacity className={`w-[97%] h-[90%] rounded-[50px] bg-[#186f65] ${toggle === "ride" ? origin === null || destination === null ? "opacity-30" : "opacity-100" : origin === null || destination === null || deliveryType === null ? "opacity-30" : "opacity-100" } items-center justify-center`} disabled={toggle === "ride" ? destination === null || origin === null ? true : false : destination === null || origin === null || deliveryType === null ? true : false} onPress={() => {
                                        navigation.goBack()
                                        navigation.navigate("BookNavigator")
                                    }}>
                                        <Text style={{fontSize: fontSize}} className={`font-semibold tracking-tight text-white`}>{toggle === "ride" ? "Choose Ride" : "Specify Recipient"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
    )
}

export default SearchModal;

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "column",
        backgroundColor: "transparent"
    },
})