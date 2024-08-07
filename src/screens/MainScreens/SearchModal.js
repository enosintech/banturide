import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {Text, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, TouchableOpacity, StyleSheet, Dimensions, Platform, PixelRatio, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { GOOGLE_API_KEY } from "@env";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import { setOrigin, setDestination, selectTripType, selectToggle, setSchoolPickup, selectSchoolPickup, selectPassThrough, setPassThrough, selectPaymentMethod, setPaymentMethod } from "../../../slices/navSlice";
import { selectDestination, selectOrigin, setTripType } from "../../../slices/navSlice";
import { useState } from "react";
import { deliveryData } from "../../constants";
import { selectUserInfo } from "../../../slices/authSlice";

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

    const height = Dimensions.get("window").height;

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const navigation = useNavigation();

    const dispatch = useDispatch()
    const originRef = useRef();
    const passThroughRef = useRef();
    const destinationRef = useRef();
    const [ greeting, setGreeting ] = useState("");
    const [ selected, setSelected ] = useState(false);
    const [ stopAdded, setStopAdded ] = useState(false);
    const [ paymentVisible, setPaymentVisible ] = useState(false)

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
            keyboardVerticalOffset={getFontSize(10)}
        >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <View style={{height: 0.5 * height}} className={`w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-gray-100"} items-center rounded-t-2xl`}>
                <View className={`h-[3%] w-full items-center justify-center border-b-[0.25px]`}>
                    <ShortModalNavBar />
                </View>
                <View className={`h-[10%] w-full border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} items-center justify-center`}>
                    <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>{greeting + " " + userInfo?.firstname}</Text>
                </View>
                <View className={`w-[84.8%] rounded-[25px] h-[13.5%] mt-2 bg-white flex-row ${toggle !== "ride" ? "hidden" : "flex"}`}>
                    <TouchableOpacity className={`w-1/2 rounded-[25px] ${tripType !== "normal" ? "bg-white" : "bg-[#186f65]"} h-full flex items-center justify-center`} onPress={() => {
                        dispatch(setTripType("normal"))
                    }}>
                        <Text style={{fontSize: getFontSize(20)}} className={`font-bold tracking-tight ${tripType !== "normal" ? "text-black" :"text-white"}`}>Single Trip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true} className={`w-1/2 rounded-[40px] opacity-20 ${tripType !== "normal" ? "bg-[#186f65]" : "bg-white"} h-full flex items-center justify-center`} onPress={() => {
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
                        <Text style={{fontSize: getFontSize(16)}} className={`font-bold tracking-tight ${tripType !== "normal" ? "text-white" : "text-black"}`}>All-day Booking</Text>
                        <Text tyle={{fontSize: getFontSize(14)}} className={`font-light tracking-tight`}>Coming Soon</Text>
                    </TouchableOpacity>
                </View>
                {/* <View className={`w-[85%] h-[7%] mt-2 flex-row items-center justify-between ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"} rounded-[14px] px-3 ${tripType !== "normal" || toggle !== "ride" ? "hidden" : "flex"}`}>
                        <View className={`flex-row items-center gap-x-2`}>
                            <MaterialCommunityIcons name="bus-school" size={getFontSize(22)} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>School Pick-up/ Drop-off</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setSelected(!selected)
                        }}>
                            <FontAwesome name={schoolPickup ? "toggle-on" : "toggle-off"} size={getFontSize(30)} color={props.theme === "dark" ? "white" : "#186f65"}/>
                        </TouchableOpacity>
                </View> */}
                <View className={`w-[85%] h-fit mt-2 rounded-[25px] relative z-10 flex justify-between ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"}`}>
                    <View className={`flex-row items-center justify-center w-full h-[60px] shadow-2xl relative z-[60]`}>
                        <View className={`w-[15%] items-center h-full justify-center `}>
                            <MaterialIcons name="trip-origin" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`} />
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
                                    fontSize: 18,
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
                                }
                            }}
                            textInputProps={{
                                placeholder: toggle === "ride" ? "Where From?" : "Pick Up?",
                                placeholderTextColor: "gray",
                            }}
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
                                components: "country:zm"
                            }}
                            fetchDetails={true}
                            enablePoweredByContainer={false}
                            minLength={2}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={200}
                        />
                    </View>
                    <View className={`w-full h-[35px] items-center justify-center ${tripType === "normal" && !stopAdded ? "flex" : "hidden"}`}>
                        <TouchableOpacity className={`rounded-full w-[25%] h-[90%] items-center justify-center shadow border ${props.theme === "dark" ? "bg-[#5a626e] border-gray-700" : "bg-white border-gray-100"}`} onPress={() => {
                            setStopAdded(!stopAdded);
                        }}>
                            <Text style={{fontSize: getFontSize(14)}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        tripType === "normal"
                        &&
                        <View className={`flex-row items-center justify-center w-full h-[65px] shadow-2xl relative z-50 ${stopAdded === false ? "hidden" : "flex"} `}>
                            <View className={`w-[15%] items-center h-full justify-center`}>
                                <TouchableOpacity className={`  w-8 h-8 rounded-full shadow border items-center justify-center ${props.theme === "dark" ? "bg-[#5a626e] border-gray-700" : "bg-white border-gray-100"}`} onPress={handleSwitch}>
                                    <Octicons name="arrow-switch" size={19} color={props.theme === "dark" ? "white" : "black"} />
                                </TouchableOpacity>
                            </View>
                            <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-white" : "border-gray-800"}`}></View>
                            <View className={`absolute w-[25%] h-full right-0 z-50 flex items-center justify-center`}>
                                <TouchableOpacity className={`rounded-full w-[85%] -translate-x-1 h-[50%] items-center justify-center shadow border ${props.theme === "dark" ? "bg-[#5a626e] border-gray-700" : "bg-white border-gray-100"}`} onPress={() => {
                                    setStopAdded(!stopAdded);
                                    dispatch(setPassThrough(null));
                                    passThroughRef?.current.clear();
                                }}> 
                                    <Text style={{fontSize: getFontSize(10)}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Remove Stop</Text>
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
                                debounce={200}
                            />
                        </View>
                    }

                    <View className={`flex-row items-center justify-center w-full h-[65px] shadow-2xl relative z-40 ${tripType !== "normal" ? "hidden" : "flex"}`}>
                        <View className={`w-[15%] items-center h-full justify-center`}>
                            <FontAwesome name="flag-checkered" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
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
                                    fontSize: 18,
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
                            debounce={200}
                        />
                    </View>
                </View>
                <View className={`${toggle === "ride" ? "hidden" : "flex"} flex-row items-center justify-between mt-2 w-[85%] h-[20%]`}>
                    {deliveryData.map((item, index) => (
                        <TouchableOpacity key={item.id} className={`w-[31.5%] h-[97%] rounded-[20px] bg-white`}></TouchableOpacity>
                    ))}
                </View>
                <View className={`w-[85%] h-[18%] ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"} ${tripType === "normal" ? "hidden" : "flex"} mt-2 rounded-[40px] `}>

                </View>
                <View className={`w-[85%] h-[18%] ${props.theme === "dark" ? "bg-[#3b434e]" : "bg-white"} mt-2 rounded-[25px] flex relative ${paymentVisible ? "z-20" : "z-5"}`}>
                    <View className={`w-full h-full flex flex-row relative`}>
                    {
                        paymentVisible && 

                        <View className={`w-full h-[100px] bg-white shadow absolute bottom-[100%] rounded-[25px] flex flex-col z-[100] px-3`}>
                            <TouchableOpacity className="w-full h-1/2 flex flex-row items-center" onPress={() => {
                                dispatch(setPaymentMethod("cash"))
                                setPaymentVisible(false);
                            }}>
                                <Ionicons name="cash" color={"green"} size={25}/>
                                <Text style={{fontSize: getFontSize(16)}} className="ml-2">Cash</Text>
                            </TouchableOpacity>
                            <View className="w-full h-0 border-[0.5px] border-gray-200"></View>
                            <TouchableOpacity className="w-full h-1/2 flex flex-row items-center" onPress={() => {
                                dispatch(setPaymentMethod("mobileMoney"))
                                setPaymentVisible(false);
                            }}>
                                <Entypo name="wallet" color={"black"} size={25} />
                                <Text style={{fontSize: getFontSize(16)}} className="ml-2">Mobile Money</Text>
                            </TouchableOpacity>
                        </View>

                    }

                        <TouchableOpacity className={`w-[18%] h-full flex items-center justify-center`} onPress={() => setPaymentVisible(!paymentVisible)}>
                            {paymentMethod === "cash" ? 
                                <Ionicons name="cash" size={getFontSize(30)} color="green" />
                            :
                                <Entypo name="wallet" color={"black"} size={getFontSize(30)} />
                            }
                        </TouchableOpacity>
                        <View className={`w-[82%] h-full flex items-center justify-center`}>
                            <TouchableOpacity className={`w-[97%] h-[90%] rounded-[25px] shadow-2xl bg-[#186f65] ${!destination && tripType === "normal" || !origin && tripType !== "normal" ? "opacity-25" : destination && tripType === "normal" || origin && tripType !== "normal" ? "opacity-100" : ""} items-center justify-center`} disabled={tripType === "normal" ? !destination : !origin} onPress={() => {
                                navigation.goBack()
                                navigation.navigate("BookNavigator")
                            }}>
                                <Text style={{fontSize: getFontSize(20)}} className={`font-semibold tracking-tight text-white`}>{toggle === "ride" ? "Choose Ride" : "Specify Recipient"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
    },
})