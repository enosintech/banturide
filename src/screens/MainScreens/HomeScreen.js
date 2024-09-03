import {Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import Geocoder from "react-native-geocoding";
import Ionicons from "@expo/vector-icons/Ionicons";

import { GOOGLE_API_KEY } from "@env";

import Map from "../../components/atoms/Map";
import PageLoader from "../../components/atoms/PageLoader";

import { selectDestination, selectOrigin, selectToggle, selectBooking, selectTripDetails, selectPrice, selectTravelTimeInformation, setTripDetails, setTripType, selectDriver, selectOnTheWay, selectHasArrived, setPassThrough, selectTripType, selectPassThrough, setWsClientId, selectWsClientId, addDriver, selectDriverArray, setBooking, setDriver, selectRemainingTripTime, selectRemaingTripDistance, setDeliveryType, setRecipient, selectDeliveryType, selectFavoritesData, setRemainingTripTime, setRemainingTripDistance } from "../../../slices/navSlice";
import { setOrigin, setDestination, setToggle } from "../../../slices/navSlice";
import { selectNotificationsArray } from "../../../slices/notificationSlice";
import { selectUserCurrentLocation, setUserCurrentLocation } from "../../../slices/authSlice";

Geocoder.init("AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE");

const { width } = Dimensions.get("window");

const HomeScreen = (props) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const origin = useSelector(selectOrigin);
    const passThrough = useSelector(selectPassThrough);
    const destination = useSelector(selectDestination);
    const toggle = useSelector(selectToggle);
    const booking = useSelector(selectBooking);
    const tripDetails = useSelector(selectTripDetails);
    const tripType = useSelector(selectTripType);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const price = useSelector(selectPrice);
    const searchComplete = useSelector(state => state.nav.searchComplete);
    const notificationsArray = useSelector(selectNotificationsArray);
    const remainingTripTime = useSelector(selectRemainingTripTime);
    const remainingTripDistance = useSelector(selectRemaingTripDistance);
    const deliveryType = useSelector(selectDeliveryType);
    const favoritesData = useSelector(selectFavoritesData);

    const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const currentLocation = useSelector(selectUserCurrentLocation);
    const [currentStreet, setCurrentStreet] = useState(null)
    const mapRef = useRef(null);

    const [ error, setError ] = useState(false);

    const fontSize = width * 0.05;

    const unreadNotifications = notificationsArray.filter(notification => notification.status === "unread");

    const goToCurrent = () => {
        mapRef.current?.animateToRegion(currentLocation, 1 * 1000)
    }

    const goToOrigin = () => {
        mapRef.current?.animateToRegion({
            latitude: origin?.location.lat,
            longitude: origin?.location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        }, 1 * 1000) 
    }

    const goToCarLocation = () => {
        mapRef.current?.animateToRegion({
            latitude: booking?.driverCurrentLocation[0],
            longitude: booking?.driverCurrentLocation[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        }, 1 * 1000)
    }

    const expandMaptoViewRoute = () => {
        if(!booking) return;

        if(booking?.status === "pending" && booking?.hasThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['origin', 'stop', 'destination'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "pending" && !booking?.hasThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['origin', 'destination'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "confirmed"){
            mapRef.current?.fitToSuppliedMarkers(['origin', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "ongoing" && booking?.hasThirdStop && !booking?.reachedThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'stop', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "ongoing" && booking?.hasThirdStop && booking?.reachedThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "ongoing" && !booking?.hasThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "arrived"){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }
    }

    const getLocation = async () => {
        try {

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted"){
                setError("Location access not granted")
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            dispatch(setUserCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.010,
                longitudeDelta: 0.010
            }))

        } catch (error) {
            setError(error.error || error.message || "Failed to get current location")
        }
    };

    useEffect(() => {
        getLocation();
    }, [])

    useEffect(() => {
        props.setInitialRegion(currentLocation)
    }, [currentLocation])

    useEffect(() => {
        if(!booking) return;

        if(booking?.status === "pending" && booking?.hasThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['origin', 'stop', 'destination'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "pending" && !booking?.hasThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['origin', 'destination'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "confirmed"){
            mapRef.current?.fitToSuppliedMarkers(['origin', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "ongoing" && booking?.hasThirdStop && !booking?.reachedThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'stop', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "ongoing" && booking?.hasThirdStop && booking?.reachedThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "ongoing" && !booking?.hasThirdStop){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }

        if(booking?.status === "arrived"){
            mapRef.current?.fitToSuppliedMarkers(['destination', 'driver'], {
                edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
            })        
        }
        
        
    }, [booking])

    useEffect(() => {
        if (currentLocation) {
            Geocoder.from(currentLocation.latitude, currentLocation.longitude)
        .then(json => {
            const location = json.results[1].address_components[0].long_name;
            setCurrentStreet(location);
            setError(false)
        })
        .catch(error => {
            setError(error.error || error.message || "Problem fetching currrent street")
        })
        }
    }, [currentLocation])


    useEffect(() => {

        if(!booking) return;
    
        const getTripTime = async () => {
          fetch(
            `https://maps.googleapis.com/maps/api/directions/json?destination=${booking?.dropOffLocation?.latitude},${booking?.dropOffLocation?.longitude}&origin=${booking?.driverCurrentLocation[0]},${booking?.driverCurrentLocation[1]}&key=${api}`
          )
          .then((res) => res.json())
          .then(data => {
            dispatch(setRemainingTripTime(parseInt(data?.routes[0]?.legs[0]?.duration?.text)))
            dispatch(setRemainingTripDistance(parseInt(data?.routes[0]?.legs[0]?.distance?.text)))
          }) 
          .catch((error) => {
            console.log("failure")
          })
        }
    
        if(booking?.status === "ongoing" && booking?.driverCurrentLocation){
          getTripTime();
        }
    
      }, [booking, booking?.driverCurrentLocation, api])

    return(
        <View className={`h-full w-full relative`} onLayout={props.handleLayout}>
            <View className={`h-full w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-gray-100"}`}>
                <Map theme={props.theme} mapRef={mapRef} currentLocation={currentLocation} initialRegion={props.initialRegion} setInitialRegion={props.setInitialRegion} setCurrentLocation={setUserCurrentLocation}/>
            </View>

            {booking 
            ?
                <View className="absolute h-[18%] w-full bottom-[9%] flex items-center">
                    <View className="h-full w-[97%] p-3 flex items-center justify-center">
                        <TouchableOpacity className={`w-full h-full flex flex-row border-4 items-center rounded-[25px] px-1 shadow-sm ${props.theme === "dark" ? "bg-dark-extra border-dark-extra" : "bg-white border-white"}`} onPress={() => {
                            if(booking?.status === "confirmed" || booking?.status === "ongoing" || booking?.status === "arrived" || booking?.status === "completed"){
                                navigation.navigate("RequestNavigator")
                            } else {
                                navigation.navigate("requests")
                            }
                        }}>
                            <View className={`h-full w-1/2 flex items-center justify-center`}>
                                <View className={`relative w-full h-1/2 flex items-center rounded-[30px] overflow-hidden`}>
                                    <Image 
                                        source={booking?.bookingType === "ride" ? tripDetails?.image : deliveryType?.image}
                                        style={{
                                            width: fontSize * 2,
                                            height: fontSize * 2,
                                            resizeMode: "contain",
                                        }}
                                    />
                                    <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>{booking?.bookingType === "ride" ? tripDetails?.title : deliveryType?.title }</Text>
                                </View>
                                <View className={`w-[80%] h-0 border-t ${props.theme === "dark" ? "border-white" : "border-gray-200"}`}></View>
                                <View className={`w-full h-1/2 flex items-center rounded-[25px]`}>
                                    <View className={`w-full h-2/3 flex items-center justify-center`}>
                                        {price
                                        ?
                                        <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-gray-700"} font-black tracking-tight`}>{price}</Text>                              
                                        :
                                        <PageLoader theme={props.theme} width="60%" height="70%"/>
                                        }
                                    </View>
                                    <View className={`w-[75%] h-1/3 flex-row items-center justify-evenly`}>
                                        {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontSize: fontSize * 0.6}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>{booking?.status !== "ongoing" && booking?.status !== "arrived" ? travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text): remainingTripDistance} KM</Text>
                                            :
                                                <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                                        :
                                            <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Chaffeur</Text>
                                        }
                                        {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontSize: fontSize * 0.6}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>{booking?.status !== "ongoing" && booking?.status !== "arrived" ? travelTimeInformation.length > 1 ? parseInt(travelTimeInformation[0].duration.text) + parseInt(travelTimeInformation[1].duration.text) : parseInt(travelTimeInformation[0].duration.text) : remainingTripTime} Mins</Text>
                                            :
                                                <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                                        :
                                            <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Mode</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View className={`w-1/2 h-full py-1`}>
                                <View className={`h-full w-full py-1 px-1 pb-2 flex items-center justify-between rounded-[40px]`}>
                                    <View className={`relative h-[45%] w-full flex items-center justify-center overflow-hidden rounded-[40px]`}>
                                        {
                                            booking?.status !== "pending" || searchComplete
                                            ?
                                            <View className={`w-full h-full rounded-[25px] bg-[#186f65] absolute`}></View>
                                            :
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
                                        }
                                        <Text style={{fontSize: fontSize * 0.65}} className={`${booking?.status === "confirmed" || booking?.status === "ongoing" || booking?.status === "arrived" || booking?.status === "completed" || searchComplete ? "text-white" : props.theme === "dark"  ? "text-white" : "text-black"} font-black tracking-tight`}>{booking?.status === "confirmed" && !booking?.driverArrivedAtPickup ? "Driver is on the way" : booking?.status === "confirmed" && booking?.driverArrivedAtPickup ? "Driver has Arrived" : booking?.status === "ongoing" && booking?.bookingType === "ride" ? "You're on the way!" : booking?.status === "ongoing" && booking?.bookingType === "delivery" ? "Package on the way!" : booking?.status === "arrived" && booking?.bookingType === "ride" ? "You have arrived" : booking?.status === "arrived" && booking?.bookingType === "delivery" ? "Driver at Drop-Off" : booking?.status === "completed" ? "Rate Driver" : booking?.status === "pending" && searchComplete !== true ? "Looking for drivers..." : "Search Complete"}</Text>
                                    </View>
                                    <View className={`h-[45%] w-full flex items-center relative rounded-[30px] pl-2 justify-center ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"} shadow-sm`}>
                                        <View className={`w-[90%]`}>
                                            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" && booking?.status === "confirmed" ? "text-white" : props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>Origin</Text>
                                            <Text style={{fontSize: fontSize * 0.4}}  className={`${props.theme === "dark" ? "text-white" : "text-gray-500"} w-[90%] font-light tracking-tight`}>{origin?.description.split(",")[0]}</Text>
                                        </View>
                                        <View className={`w-[90%]`}>
                                            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" && booking?.status === "confirmed" ? "text-white" : props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>Destination</Text>
                                            <Text style={{fontSize: fontSize * 0.4}} className={`${props.theme === "dark" ? "text-white" : "text-gray-500"} w-[90%] font-light tracking-tight`}>{destination?.description.split(",")[0]}</Text>
                                        </View>
                                        <View className={`absolute right-2 bg-[#186f65] flex items-center justify-center p-2 rounded-[50px]`}>
                                            <Text style={{fontSize: fontSize * 0.6}} className="text-white font-semibold tracking-tight">{passThrough ? "1 Stop" : "No Stop"}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            :
                <View className="absolute h-[18%] w-full bottom-[9%] flex items-center">
                    <View className={`h-full w-[97%] rounded-[50px]  p-3 flex items-center justify-evenly`}>
                        <View className={`w-[98%]  h-[45%] ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-[50px] shadow-sm `}>
                            {origin && destination 
                            ? 
                            <TouchableOpacity className={`w-full h-full bg-[#186f65] rounded-[50px] items-center justify-center`} onPress={() => {
                                navigation.navigate("BookNavigator")
                            }}>
                                <Text style={{fontSize: fontSize * 0.85}} className={`text-white font-semibold tracking-tight`}>Continue Booking</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity className={`w-full h-full ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-[50px] flex-row pl-2 items-center`} onPress={() => {
                                navigation.navigate("Search")
                            }}>
                                <Ionicons name="search" size={fontSize * 1.3} color="gray"/>
                                <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-gray-500" : "text-gray-300"} ml-2 font-semibold tracking-tight`}>{toggle === "ride" ? "Where to?" : toggle === "delivery" ? "Pick Up?" : "Welcome to Bantu Ride"}</Text>
                            </TouchableOpacity>
                            }
                        </View>
        
                        <View className={`w-[98%]  h-[45%] flex-row bg-white rounded-[50px] shadow-sm ${origin && destination ? "p-0" : "p-1"}`}>
                            { origin && destination 
                            ?
                                <TouchableOpacity className={`w-full h-full ${props.theme === "dark" ? "bg-gray-300" : "bg-white"} rounded-[50px] items-center justify-center`} onPress={() => {
                                    dispatch(setOrigin(null))
                                    dispatch(setPassThrough(null))
                                    dispatch(setDestination(null))
                                    dispatch(setDeliveryType(null))
                                    dispatch(setRecipient(null))
                                    navigation.navigate("Search")
                                }}>
                                    <Text style={{fontSize: fontSize * 0.85}} className={`text-black font-semibold tracking-tight`}>Make New Booking</Text>
                                </TouchableOpacity>
                            :
                            <>
                                <TouchableOpacity className={`w-[50%] h-[100%] ${toggle === "ride" ? "bg-[#186F65]" : "bg-white" } items-center justify-center rounded-[50px]`} onPress={() => {
                                    dispatch(setToggle("ride"))
                                    dispatch(setTripType("normal"))
                                    dispatch(setDeliveryType(null))
                                }}>
                                    <Text style={{fontSize: fontSize * 1.1}} className={`${toggle === "ride" ? "text-white" : "text-black"} font-semibold tracking-tight`}>Ride</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={`w-[50%] h-[100%] ${toggle === "delivery" ? "bg-[#186F65]" : "bg-white" } items-center justify-center  rounded-[50px] `} onPress={() => {
                                    dispatch(setToggle("delivery"))
                                    dispatch(setTripType("normal"))
                                }}>
                                    <Text style={{fontSize: fontSize * 1.1}} className={`${toggle === "delivery" ? "text-white" : "text-black"} font-semibold tracking-tight`}>Delivery</Text>
                                </TouchableOpacity>
                            </>
                            }
                        </View>
                    </View>
                </View>
            }
            
            <TouchableOpacity className={`absolute z-[9999] top-[7%] right-[5%] rounded-2xl shadow ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} p-[3%] items-center justify-center`} onPress={() => {
                navigation.navigate("Notifications")
            }}>
                <Ionicons name="notifications" size={fontSize * 1.1} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                <View style={{ width: fontSize, height: fontSize}} className={`rounded-full bg-red-600 flex items-center justify-center absolute -top-[6px] -left-[6px]`}>
                    <Text className={`text-white`}>{unreadNotifications?.length}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity className={`absolute bottom-[27%] right-[5%] rounded-2xl shadow ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} ${!props.initialRegion ? "opacity-50" : "opacity-100"} p-[3%] items-center justify-center`} onPress={() => booking?.status === "ongoing" || booking?.status === "arrived" ? goToCarLocation() : booking?.status === "confirmed" ? goToOrigin() : goToCurrent()} disabled={!props.initialRegion}>
                <MaterialIcons name="my-location" size={fontSize * 1.1} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <TouchableOpacity className={`absolute bottom-[27%] left-[5%] rounded-2xl shadow ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} ${!booking ? "opacity-50" : "opacity-100" } p-[3%] items-center justify-center`} onPress={() => expandMaptoViewRoute()} disabled={!booking}>
                <MaterialCommunityIcons name="arrow-expand" size={fontSize * 1.1} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>

            <View className="absolute top-[13%] w-full">
                <Text style={{fontSize: fontSize * 0.85}} className={`mx-auto text-lg ${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>{error ? "Error getting current street" : "You are on"}</Text>
                <Text style={{fontSize: !error ? fontSize * 1.2 : fontSize }} className={`mx-auto text-lg tracking-wide ${!error && "uppercase"} ${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>{currentStreet ? currentStreet : error && !currentStreet ? "Something went wrong" : "Searching..."}</Text>
            </View>
        </View> 
    )
}

export default HomeScreen;                                                     