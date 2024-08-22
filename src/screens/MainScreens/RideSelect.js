import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";

import { GOOGLE_API_KEY } from "@env";

import { selectBookingRequestLoading, selectDestination, selectOrigin, selectPassThrough, selectTravelTimeInformation } from "../../../slices/navSlice";
import { setTravelTimeInformation, setPassThrough, setDestination, setPrice } from "../../../slices/navSlice";

import ConfirmScreen from "./ConfirmScreen";
import ChooseRide from "./ChooseRide";
import TogglePayment from "./TogglePayment";
import AddStop from "./AddStop";

import LoadingBlur from "../../components/atoms/LoadingBlur";
import SmallMap from "../../components/atoms/SmallMap";

const RideSelect = (props) => {
    const Stack = createNativeStackNavigator();

    const origin = useSelector(selectOrigin);
    const passThrough = useSelector(selectPassThrough);
    const destination = useSelector(selectDestination);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const bookingRequestLoading = useSelector(selectBookingRequestLoading);

    const navigation = useNavigation();
    const mapRef = useRef(null)
    const dispatch = useDispatch();

    const SURGE_CHARGE_RATE = 1.5;

    const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

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
            fetch(
                `https://maps.googleapis.com/maps/api/directions/json?destination=${destination.description}&origin=${origin.description}&waypoints=${passThrough ? passThrough.description : "" }&key=${api}`
            )
            .then((res) => res.json())
            .then(data => {
                dispatch(setTravelTimeInformation(data.routes[0].legs))
            });
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
            <LoadingBlur theme={props.theme} loading={bookingRequestLoading} />
            <View className={`h-1/2 w-full`}>
                <TouchableOpacity className={`absolute z-50 top-[15%] left-[5%] rounded-2xl shadow-sm ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.goBack()
                }}>
                    <Ionicons name="chevron-back" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
                </TouchableOpacity>
                <SmallMap expandMap={showFullJourneyOnMap} expandMapRef={mapRef} initialRegion={props.initialRegion} theme={props.theme}/>
                <TouchableOpacity className={`absolute bottom-[10%] left-[5%] rounded-2xl shadow-sm ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"}  h-[40px] w-[40px] items-center justify-center`} onPress={() => showFullJourneyOnMap()}>
                    <MaterialCommunityIcons name="arrow-expand" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </TouchableOpacity>
                <TouchableOpacity disabled={!passThrough} className={`absolute bottom-[10%] rotate-90 ${passThrough ? "opacity-100" : "opacity-40"} right-[5%] rounded-2xl shadow-sm ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"}  h-[40px] w-[40px] items-center justify-center`} onPress={handleSwitch}>
                    <Octicons name="arrow-switch" size={19} color={props.theme === "dark" ? "white" : "black"} />
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
                    <Stack.Group screenOptions={{presentation: "modal", contentStyle: {
                            backgroundColor: "transparent",
                    }}}>
                        <Stack.Screen name="togglePayment" options={{headerShown: false }}>
                            {() => <TogglePayment theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="addStop" options={{headerShown: false }}>
                            {() => <AddStop theme={props.theme}/>}
                        </Stack.Screen>
                    </Stack.Group>
                </Stack.Navigator>
            </View>
        </View>
    )
}

export default RideSelect;
