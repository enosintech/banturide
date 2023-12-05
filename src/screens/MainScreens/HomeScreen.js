import { useNavigation } from "@react-navigation/native";
import {Text, View, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";

import { GOOGLE_API_KEY } from "@env";

import Map from "../../components/atoms/Map";
import { selectDestination, selectOrigin, selectToggle, selectBooking, selectTripDetails, selectPrice, selectTravelTimeInformation } from "../../../slices/navSlice";
import { setOrigin, setDestination, setToggle } from "../../../slices/navSlice";

Geocoder.init(GOOGLE_API_KEY);

const HomeScreen = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const toggle = useSelector(selectToggle);
    const booking = useSelector(selectBooking);
    const tripDetails = useSelector(selectTripDetails);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const price = useSelector(selectPrice);
    const [ currentLocation, setCurrentLocation ] = useState(null)
    const [currentStreet, setCurrentStreet] = useState(null)
    const mapRef = useRef(null);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted"){
            console.log("Permission to access location was denied")
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.010,
            longitudeDelta: 0.010
        });
    };


    const goToCurrent = () => {
        mapRef.current.animateToRegion(currentLocation, 1 * 1000)
    }

    const expandMaptoViewRoute = () => {
        if(!origin || !destination) return;

        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
        })
    }

    useEffect(() => {
        getLocation();
    }, [])

    useEffect(() => {
        props.setInitialRegion(currentLocation)
    }, [currentLocation])

    useEffect(() => {
        if (currentLocation) {
            Geocoder.from(currentLocation.latitude, currentLocation.longitude)
        .then(json => {
            const location = json.results[1].address_components[0].long_name
            setCurrentStreet(location);
        })
        .catch(error => console.warn(error))
        }
    }, [currentLocation])

    return(
        <View className={`h-full w-full relative`} onLayout={props.handleLayout}>
            <View className={`h-full w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-gray-100"}`}>
                <Map theme={props.theme} mapRef={mapRef} currentLocation={currentLocation} initialRegion={props.initialRegion} setInitialRegion={props.setInitialRegion} setCurrentLocation={setCurrentLocation}/>
            </View>

            {booking 
            ?
                <View className="absolute h-[18%] w-full bottom-[17%] flex items-center">
                    <View className="h-full w-[98%] p-3 fleex items-center justify-center">
                        <TouchableOpacity className={`w-full h-full flex flex-row border-4 items-center rounded-2xl  shadow-2xl ${props.theme === "dark" ? "bg-[#0e1115] border-[#0e1115]" : "bg-white border-white"}`} onPress={() => {
                            navigation.navigate("RequestNavigator")
                        }}>
                            <View className={` h-full w-1/2 flex items-center justify-center rounded-2xl`}>
                                <View className={`relative w-full h-1/2 flex items-center justify-center rounded-2xl overflow-hidden`}>
                                    <Image 
                                        source={tripDetails?.image}
                                        style={{
                                            width: 90,
                                            height: 90,
                                            resizeMode: "contain",
                                        }}
                                        className={`absolute -left-12 -bottom-5`}
                                    />
                                    <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-lg tracking-wide`}>{tripDetails?.title}</Text>
                                </View>
                                <View className={`w-full h-1/2 flex flex-row rounded-2xl`}>
                                    <View className={`w-1/2 h-full flex items-center justify-center`}>
                                        <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[16px]`}>{price}</Text>
                                    </View>
                                    <View className={`w-1/2 h-full flex items-center justify-center pr-1`}>
                                        <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"} text-center`} >{travelTimeInformation?.duration?.text}</Text>
                                        <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"} mt-2 text-center`}>{travelTimeInformation?.distance?.text}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className={`h-[92%] border-l-[0.5px] border-solid ${props.theme === "dark" ? "border-white" : "border-gray-300"}`}></View>
                            <View className={` h-full w-1/2 flex rounded-2xl`}>
                                <View className={`relative h-[45%] w-full flex items-center justify-center overflow-hidden rounded-2xl`}>
                                    <LottieView 
                                        source={require("../../../assets/animations/findDriver.json")}
                                        loop
                                        autoPlay
                                        speed={1}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            position: "absolute"
                                        }}
                                    />
                                    <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Looking for Driver...</Text>
                                </View>
                                <View className={`h-[55%] w-full flex items-center justify-center`}>
                                    <View className={`w-[90%]`}>
                                        <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-gray-500" : "text-black"}`}>Origin</Text>
                                        <Text style={{fontFamily: "os-light"}}  className={`${props.theme === "dark" ? "text-white" : "text-gray-500"} w-[90%] text-[9px]`}>{origin?.description.split(",")[0]}</Text>
                                    </View>
                                    <View className={`w-[90%]`}>
                                        <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-gray-500" : "text-black"}`}>Destination</Text>
                                        <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-gray-500"} w-[90%] text-[9px]`}>{destination?.description.split(",")[0]}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            :
                <View className="absolute h-[18%] w-full bottom-[17%] flex items-center">
                    <View className={`h-full w-[95%] rounded  p-3 flex items-center justify-evenly`}>
                        <View className={`w-[98%]  h-[45%] ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-2xl shadow-2xl `}>
                            {origin && destination 
                            ? 
                            <TouchableOpacity className={`w-full h-full bg-[#186f65] rounded-2xl items-center justify-center`} onPress={() => {
                                navigation.navigate("BookNavigator")
                            }}>
                                <Text style={{fontFamily: "os-sb"}} className={`text-lg text-white`}>Continue Booking</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity className={`w-full h-full ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-2xl flex-row pl-2 items-center`} onPress={() => {
                                navigation.navigate("Search")
                            }}>
                                <Ionicons name="search" size={25} color="gray"/>
                                <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-gray-500" : "text-gray-300"} ml-2 text-xl`}>{toggle === "ride" ? "Where to?" : toggle === "delivery" ? "Where to?" : "Welcome to Bantu Ride"}</Text>
                            </TouchableOpacity>
                            }
                        </View>
        
                        <View className="w-[98%] h-[45%] flex-row bg-white rounded-2xl shadow-2xl">
                            { origin && destination 
                            ?
                                <TouchableOpacity className={`w-full h-full ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-2xl items-center justify-center`} onPress={() => {
                                    dispatch(setOrigin(null))
                                    dispatch(setDestination(null))
                                    navigation.navigate("Search")
                                }}>
                                    <Text style={{fontFamily: "os-sb"}} className={`text-lg text-black`}>Make New Booking</Text>
                                </TouchableOpacity>
                            :
                            <>
                                <TouchableOpacity className={`w-[50%] h-[100%] ${toggle === "ride" ? "bg-[#186F65]" : "bg-white" } items-center justify-center rounded-2xl`} onPress={() => {
                                    dispatch(setToggle("ride"))
                                }}>
                                    <Text style={{fontFamily: "os-sb"}} className={`text-[18px] ${toggle === "ride" ? "text-white" : "text-black"}`}>Ride</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={`w-[50%] h-[100%] ${toggle === "delivery" ? "bg-[#186F65]" : "bg-white" } items-center justify-center  rounded-2xl `} onPress={() => {
                                    dispatch(setToggle("delivery"))
                                }}>
                                    <Text style={{fontFamily:"os-sb"}} className={`text-[18px] ${toggle === "delivery" ? "text-white" : "text-black"}`}>Delivery</Text>
                                </TouchableOpacity>
                            </>
                            }
                        </View>
                    </View>
                </View>
            }
            
            <TouchableOpacity className={`absolute top-[7%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                navigation.navigate("Notifications")
            }}>
                <Ionicons name="notifications" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <TouchableOpacity className={`absolute bottom-[36%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} ${!props.initialRegion ? "opacity-50" : "opacity-100"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrent()} disabled={!props.initialRegion}>
                <MaterialIcons name="my-location" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <TouchableOpacity className={`absolute bottom-[36%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} ${!destination ? "opacity-50" : "opacity-100" } h-[40px] w-[40px] items-center justify-center`} onPress={() => expandMaptoViewRoute()} disabled={!destination}>
                <MaterialCommunityIcons name="arrow-expand" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <View className="absolute top-[10%] w-full">
                <Text style={{fontFamily: "os-light"}} className={`mx-auto text-lg ${props.theme === "dark" ? "text-white" : "text-black"}`}>You are currently on</Text>
                <Text style={{fontFamily: "os-xb"}} className={`mx-auto text-lg tracking-wide uppercase ${props.theme === "dark" ? "text-white" : "text-black"}`}>{currentStreet ? currentStreet : "Searching..."}</Text>
            </View>
        </View> 
    )
}

export default HomeScreen;