import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";

import { GOOGLE_API_KEY } from "@env";

import { selectBookingRequestLoading, selectDestination, selectGlobalBookingError, selectOrigin, selectPassThrough, selectTravelTimeInformation } from "../../../slices/navSlice";
import { setTravelTimeInformation, setPassThrough, setDestination, setPrice } from "../../../slices/navSlice";

import ConfirmScreen from "./ConfirmScreen";
import ChooseRide from "./ChooseRide";
import TogglePayment from "./TogglePayment";
import AddStop from "./AddStop";

import LoadingBlur from "../../components/atoms/LoadingBlur";
import SmallMap from "../../components/atoms/SmallMap";

const { width } = Dimensions.get("window");

const RideSelect = (props) => {
    const Stack = createNativeStackNavigator();

    const origin = useSelector(selectOrigin);
    const passThrough = useSelector(selectPassThrough);
    const destination = useSelector(selectDestination);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const bookingRequestLoading = useSelector(selectBookingRequestLoading);
    const globalBookingError = useSelector(selectGlobalBookingError);

    const navigation = useNavigation();
    const mapRef = useRef(null)
    const dispatch = useDispatch();

    const SURGE_CHARGE_RATE = 1.5;

    const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const fontSize = width * 0.05;

    const showFullJourneyOnMap = () => {
        if(!origin || !destination) return ;
  
        mapRef.current.fitToSuppliedMarkers(['origin', 'stop', 'destination'], {
          edgePadding: {top: 100, right: 70, bottom: 70, left: 70}
        })
    }

    const handleSwitch = () => {
        dispatch(setTravelTimeInformation(null))
        dispatch(setPrice(null));
        dispatch(setPassThrough(destination));
        dispatch(setDestination(passThrough));
    }

    useEffect(() => {
        if(!origin || !destination) return ;

        const getTravelTime = async () => {
            const url = passThrough ? `https://maps.googleapis.com/maps/api/directions/json?destination=${destination?.location?.lat},${destination?.location?.lng}&origin=${origin?.location?.lat},${origin?.location?.lng}&waypoints=${passThrough.location.lat},${passThrough.location.lng}&key=${api}` : `https://maps.googleapis.com/maps/api/directions/json?destination=${destination?.location?.lat},${destination?.location?.lng}&origin=${origin?.location?.lat},${origin?.location?.lng}&key=${api}`
            fetch(
                url
            )
            .then((res) => res.json())
            .then(data => {
                dispatch(setTravelTimeInformation(data.routes[0].legs))
            })
            .catch((error) => {
                console.log(error)
            })
        }

        getTravelTime();

    }, [origin, destination, passThrough, api])

    useEffect(() => {
        if(travelTimeInformation){
            dispatch(setPrice(new Intl.NumberFormat("en-zm", {
                style: "currency",
                currency: "ZMW",
            }).format(
              (travelTimeInformation?.length > 1 ? (travelTimeInformation[0].duration.value + travelTimeInformation[1].duration.value) * SURGE_CHARGE_RATE * 1.5 / 100  : travelTimeInformation[0].duration.value * SURGE_CHARGE_RATE * 1.5 / 100)
            )))
        }
    }, [travelTimeInformation])

    return(
        <View className="w-full h-full">

            {globalBookingError &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof globalBookingError === "string" ? globalBookingError : "Server or Network Error Occurred"}</Text>
                    </View>
                </View>
            }

            <LoadingBlur theme={props.theme} loading={bookingRequestLoading} />
            <View className={`h-1/2 w-full`}>
                <TouchableOpacity style={{ width : fontSize * 2.5, height: fontSize * 2.5}} className={`absolute z-50 top-[15%] left-[5%] rounded-2xl shadow ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} items-center justify-center`} onPress={() => {
                    navigation.goBack()
                }}>
                    <Ionicons name="chevron-back" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`} />
                </TouchableOpacity>
                <SmallMap expandMap={showFullJourneyOnMap} expandMapRef={mapRef} initialRegion={props.initialRegion} theme={props.theme}/>
                <TouchableOpacity style={{ width : fontSize * 2.5, height: fontSize * 2.5}} className={`absolute bottom-[10%] left-[5%] rounded-2xl shadow ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} items-center justify-center`} onPress={() => showFullJourneyOnMap()}>
                    <MaterialCommunityIcons name="arrow-expand" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </TouchableOpacity>
                <TouchableOpacity disabled={!passThrough} style={{ width : fontSize * 2.5, height: fontSize * 2.5}} className={`absolute bottom-[10%] rotate-90 ${passThrough ? "opacity-100" : "opacity-40"} right-[5%] rounded-2xl shadow ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} items-center justify-center`} onPress={handleSwitch}>
                    <Octicons name="arrow-switch" size={fontSize * 1.1} color={props.theme === "dark" ? "white" : "black"} />
                </TouchableOpacity>
            </View>
            <View className={`h-1/2 w-full`}>
                <Stack.Navigator initialRouteName="chooseride">
                    <Stack.Screen 
                        name="chooseride"
                        options={{
                            headerShown: false
                        }}
                    >
                    {() => <ChooseRide theme={props.theme}/>}
                    </Stack.Screen>
                    <Stack.Screen 
                        name="confirmscreen"
                        options={{
                            headerShown: false
                        }}
                    >
                        {() => <ConfirmScreen theme={props.theme}/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </View>
        </View>
    )
}

export default RideSelect;
