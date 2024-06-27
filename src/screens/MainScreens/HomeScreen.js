import { useNavigation } from "@react-navigation/native";
import {Text, View, TouchableOpacity, Image, PixelRatio } from "react-native";
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
import PageLoader from "../../components/atoms/PageLoader";
import { selectDestination, selectOrigin, selectToggle, selectBooking, selectTripDetails, selectPrice, selectTravelTimeInformation, setTripDetails, setTripType, selectDriver, selectOnTheWay, selectHasArrived, setPassThrough, selectTripType, selectPassThrough } from "../../../slices/navSlice";
import { setOrigin, setDestination, setToggle } from "../../../slices/navSlice";
import { selectUserData, selectUserInfo } from "../../../slices/authSlice";

Geocoder.init("AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE");

const HomeScreen = (props) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const origin = useSelector(selectOrigin);
    const passThrough = useSelector(selectPassThrough);
    const destination = useSelector(selectDestination);
    const toggle = useSelector(selectToggle);
    const booking = useSelector(selectBooking);
    const driver = useSelector(selectDriver);
    const hasArrived = useSelector(selectHasArrived);
    const onTheWay = useSelector(selectOnTheWay);
    const tripDetails = useSelector(selectTripDetails);
    const tripType = useSelector(selectTripType);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const price = useSelector(selectPrice);

    const [ currentLocation, setCurrentLocation ] = useState(null)
    const [currentStreet, setCurrentStreet] = useState(null)
    const mapRef = useRef(null);

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

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

        mapRef.current.fitToSuppliedMarkers(['origin', 'stop', 'destination'], {
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
            const location = json.results[1].address_components[0].long_name;
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
                <View className="absolute h-[18%] w-full bottom-[12%] flex items-center">
                    <View className="h-full w-[98%] p-3 fleex items-center justify-center">
                        <TouchableOpacity className={`w-full h-full flex flex-row border-4 items-center rounded-[20px]  shadow-2xl ${props.theme === "dark" ? "bg-[#0e1115] border-[#0e1115]" : "bg-white border-white"}`} onPress={() => {
                            navigation.navigate("RequestNavigator")
                        }}>
                            <View className={`h-full w-1/2 flex items-center justify-center`}>
                                <View className={`relative w-full h-1/2 flex items-center rounded-2xl overflow-hidden`}>
                                    <Image 
                                        source={tripDetails?.image}
                                        style={{
                                            width: getFontSize(40),
                                            height: getFontSize(40),
                                            resizeMode: "contain",
                                        }}
                                    />
                                    <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>{tripDetails?.title}</Text>
                                </View>
                                <View className={`w-[80%] h-0 border-t ${props.theme === "dark" ? "" : "border-gray-200"}`}></View>
                                <View className={`w-full h-1/2 flex items-center rounded-[25px]`}>
                                    <View className={`w-full h-2/3 flex items-center justify-center`}>
                                        {price
                                        ?
                                        <Text style={{fontSize: getFontSize(24)}} className={`${props.theme === "dark" ? "text-white" : "text-gray-700"} font-bold tracking-tight`}>{price}</Text>                              
                                        :
                                        <PageLoader theme={props.theme} width="60%" height="70%"/>
                                        }
                                    </View>
                                    <View className={`w-[75%] h-1/3 flex-row items-center justify-evenly`}>
                                        {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>{travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text)} KM</Text>
                                            :
                                                <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                                        :
                                            <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Chaffeur</Text>
                                        }
                                        {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>{travelTimeInformation.length > 1 ? parseInt(travelTimeInformation[0].duration.text) + parseInt(travelTimeInformation[1].duration.text) : parseInt(travelTimeInformation[0].duration.text)} Mins</Text>
                                            :
                                                <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                                        :
                                            <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Mode</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View className={`h-full w-1/2 ${driver ? "bg-[#186f65]" : ""}  flex py-1 items-center justify-between rounded-[25px]`}>
                                <View className={`relative ${driver ? "h-[50%]" : "h-[45%]"} w-full flex items-center justify-center overflow-hidden rounded-[25px]`}>
                                    {
                                        driver 
                                        ?
                                        <View className={`w-full h-full rounded-[25px] ${onTheWay ? "bg-green-200" : "bg-[#186f65]"} absolute`}></View>
                                        :
                                        <LottieView 
                                            source={require("../../../assets/animations/findDriver.json")}
                                            loop
                                            autoPlay
                                            speed={1}
                                            style={{
                                                width: getFontSize(200),
                                                height: getFontSize(200),
                                                position: "absolute"
                                            }}
                                        />
                                    }
                                    <Text style={{fontSize: getFontSize(14)}} className={`${driver ? "text-white" : props.theme === "dark"  ? "text-white" : "text-black"} font-bold tracking-tight`}>{driver && !hasArrived ? "Driver is on the way" : driver && hasArrived ? "Driver has Arrived" : driver && onTheWay ? "You're on the way!" : !driver ? "Looking for drivers..." : ""}</Text>
                                </View>
                                <View className={`h-[50%] ${driver ? "w-[95%]" : "w-full"} flex items-center relative rounded-t-[10px] rounded-b-[20px] justify-center bg-white shadow-md border-[0.5px] border-gray-100`}>
                                    <View className={`w-[90%]`}>
                                        <Text style={{fontSize: getFontSize(10)}} className={`${props.theme === "dark" && driver ? "text-gray-500" : "text-black"} font-bold tracking-tight`}>Origin</Text>
                                        <Text style={{fontSize: getFontSize(9)}}  className={`${props.theme === "dark" ? "text-white" : "text-gray-500"} w-[90%] font-light tracking-tight`}>{origin?.description.split(",")[0]}</Text>
                                    </View>
                                    <View className={`w-[90%]`}>
                                        <Text style={{fontSize: getFontSize(10)}} className={`${props.theme === "dark" && driver ? "text-gray-500" : "text-black"} font-bold tracking-tight`}>Destination</Text>
                                        <Text style={{fontSize: getFontSize(9)}} className={`${props.theme === "dark" ? "text-white" : "text-gray-500"} w-[90%] font-light tracking-tight`}>{destination?.description.split(",")[0]}</Text>
                                    </View>
                                    <View className={`absolute right-2 bg-[#186f65] flex items-center justify-center px-1 py-1 rounded-[20px]`}>
                                        <Text style={{fontSize: getFontSize(12)}} className="text-white font-semibold tracking-tight">{passThrough ? "1 Stop" : "No Stop"}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            :
                <View className="absolute h-[18%] w-full bottom-[12%] flex items-center">
                    <View className={`h-full w-[95%] rounded  p-3 flex items-center justify-evenly`}>
                        <View className={`w-[98%]  h-[45%] ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-[25px] shadow-2xl `}>
                            {origin && destination 
                            ? 
                            <TouchableOpacity className={`w-full h-full bg-[#186f65] rounded-[25px] items-center justify-center`} onPress={() => {
                                navigation.navigate("BookNavigator")
                            }}>
                                <Text style={{fontSize: getFontSize(18)}} className={`text-white font-semibold tracking-tight`}>Continue Booking</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity className={`w-full h-full ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-[25px] flex-row pl-2 items-center`} onPress={() => {
                                navigation.navigate("Search")
                            }}>
                                <Ionicons name="search" size={getFontSize(25)} color="gray"/>
                                <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-gray-500" : "text-gray-300"} ml-2 font-semibold tracking-tight`}>{toggle === "ride" ? "Where to?" : toggle === "delivery" ? "Pick Up?" : "Welcome to Bantu Ride"}</Text>
                            </TouchableOpacity>
                            }
                        </View>
        
                        <View className="w-[98%] h-[45%] flex-row bg-white rounded-[25px] shadow-2xl">
                            { origin && destination 
                            ?
                                <TouchableOpacity className={`w-full h-full ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-2xl items-center justify-center`} onPress={() => {
                                    dispatch(setOrigin(null))
                                    dispatch(setPassThrough(null))
                                    dispatch(setDestination(null))
                                    navigation.navigate("Search")
                                }}>
                                    <Text style={{fontSize: getFontSize(18)}} className={`text-black font-semibold tracking-tight`}>Make New Booking</Text>
                                </TouchableOpacity>
                            :
                            <>
                                <TouchableOpacity className={`w-[50%] h-[100%] ${toggle === "ride" ? "bg-[#186F65]" : "bg-white" } items-center justify-center rounded-[25px]`} onPress={() => {
                                    dispatch(setToggle("ride"))
                                    dispatch(setTripType("normal"))
                                }}>
                                    <Text style={{fontSize: getFontSize(18)}} className={`${toggle === "ride" ? "text-white" : "text-black"} font-semibold tracking-tight`}>Ride</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={`w-[50%] h-[100%] ${toggle === "delivery" ? "bg-[#186F65]" : "bg-white" } items-center justify-center  rounded-[25px] `} onPress={() => {
                                    dispatch(setToggle("delivery"))
                                    dispatch(setTripType("normal"))
                                }}>
                                    <Text style={{fontSize: getFontSize(18)}} className={`${toggle === "delivery" ? "text-white" : "text-black"} font-semibold tracking-tight`}>Delivery</Text>
                                </TouchableOpacity>
                            </>
                            }
                        </View>
                    </View>
                </View>
            }
            
            <TouchableOpacity className={`absolute z-[9999] top-[7%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                navigation.navigate("Notifications")
            }}>
                <Ionicons name="notifications" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <TouchableOpacity className={`absolute bottom-[30%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} ${!props.initialRegion ? "opacity-50" : "opacity-100"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrent()} disabled={!props.initialRegion}>
                <MaterialIcons name="my-location" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <TouchableOpacity className={`absolute bottom-[30%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} ${!destination ? "opacity-50" : "opacity-100" } h-[40px] w-[40px] items-center justify-center`} onPress={() => expandMaptoViewRoute()} disabled={!destination}>
                <MaterialCommunityIcons name="arrow-expand" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <View className="absolute top-[8%] w-full">
                <Text style={{fontSize: getFontSize(18)}} className={`mx-auto text-lg ${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>You are currently on</Text>
                <Text style={{fontSize: getFontSize(20)}} className={`mx-auto text-lg tracking-wide uppercase ${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>{currentStreet ? currentStreet : "Searching..."}</Text>
            </View>
        </View> 
    )
}

export default HomeScreen;                                                      