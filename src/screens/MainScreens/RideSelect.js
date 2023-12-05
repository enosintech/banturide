import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GOOGLE_API_KEY } from "@env";

import SmallMap from "../../components/atoms/SmallMap";
import { selectDestination, selectOrigin } from "../../../slices/navSlice";
import { setTravelTimeInformation } from "../../../slices/navSlice";

import ConfirmScreen from "./ConfirmScreen";
import ChooseRide from "./ChooseRide";

const RideSelect = (props) => {
    const Stack = createNativeStackNavigator();

    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const navigation = useNavigation();
    const mapRef = useRef(null)
    const dispatch = useDispatch();
    const api="AIzaSyDCK1kGQBTjZ3-KWP5I7Q4AQQ3DCTEv060";

    const showFullJourneyOnMap = () => {
        if(!origin || !destination) return ;
  
        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
          edgePadding: {top: 100, right: 70, bottom: 70, left: 70}
        })
    }

    useEffect(() => {
        if(!origin || !destination) return ;

        const getTravelTime = async () => {
            fetch(
                `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.description}&destinations=${destination.description}&key=${api}`
            )
            .then((res) => res.json())
            .then(data => {
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
            });
        }

        getTravelTime();
    }, [origin, destination, api])

    return(
        <View className="w-full h-full">
            <View className={`h-1/2 w-full`}>
                <TouchableOpacity className={`absolute z-50 top-[15%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.goBack()
                }}>
                    <Ionicons name="chevron-back" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
                </TouchableOpacity>
                <SmallMap expandMap={showFullJourneyOnMap} expandMapRef={mapRef} initialRegion={props.initialRegion} theme={props.theme}/>
                <TouchableOpacity className={`absolute bottom-[10%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"}  h-[40px] w-[40px] items-center justify-center`} onPress={() => showFullJourneyOnMap()}>
                    <MaterialCommunityIcons name="arrow-expand" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
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
