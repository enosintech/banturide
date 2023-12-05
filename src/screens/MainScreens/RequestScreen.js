import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRef } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from 'react-redux';
import { selectDestination, selectOrigin, selectPrice, selectTravelTimeInformation, selectTripDetails } from '../../../slices/navSlice';
import LottieView from "lottie-react-native";

import RequestMap from "../../components/atoms/RequestMap";

const RequestScreen = (props) => {
  const navigation = useNavigation()
  const mapRef = useRef();

  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const price = useSelector(selectPrice);
  const tripDetails = useSelector(selectTripDetails);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  const currentLocation = {
    latitude: origin?.location.lat,
    longitude: origin?.location.lng,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010
  }

  const goToCurrentLocation = () => {
    mapRef.current.animateToRegion(currentLocation, 1 * 1000)
  }

  return (
    <View className={`flex-1 ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"}`}>
      <View className={`relative h-[65%] w-full flex items-center justify-center`}>
        <TouchableOpacity className={`absolute z-50 bottom-[5%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.goBack()
                }}>
                <Ionicons name="chevron-down" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
        </TouchableOpacity>
        <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrentLocation()}>
                <MaterialIcons name="my-location" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
        <RequestMap mapRef={mapRef} theme={props.theme} />
        <View className={`absolute w-[300px] h-[300px] flex items-center justify-center`}>
            <LottieView 
              source={require("../../../assets/animations/findDriver.json")}
              loop
              autoPlay
              speed={1}
              style={{
                  width: 300,
                  height: 300
              }}
            />
            <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-xl`}>Looking For Driver...</Text>
        </View>
      </View>
      <View className={`h-[35%] w-full flex border-t-4 border-solid ${props.theme === "dark" ? " bg-[#0e1115] border-white" : "border-black"}`}>
        <View className={`w-full h-[70%] rounded-2xl flex flex-row`}>
          <View className={`w-1/2 rounded-2xl h-full`}>
            <View className={`w-full h-[37.5%] rounded-2xl flex items-center justify-center px-5`}>
              <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-gray-500" : "text-black"} text-2xl w-full`}>Origin</Text>
              <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[13px] w-full`}>{origin?.description.split(",")[0]}</Text>
            </View>
            <View className={`w-full h-[37.5%] flex items-center justify-center px-5`}>
                <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-gray-500" : "text-black"} text-2xl w-full`}>Destination</Text>
                <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[13px] w-full`}>{destination?.description.split(",")[0]}</Text>
              </View>
            <TouchableOpacity className={`flex flex-row items-center justify-center w-full h-[25%] border-t-[0.25px] border-b-[0.25px] border-r-[0.25px] ${props.theme === "dark" ? "border-gray-500" : "border-gray-300"}`}>
              <Ionicons name='add' size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
              <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
            </TouchableOpacity>
          </View>
          <View className={`w-1/2 h-full rounded-t-2xl`}>
            <View className={`relative w-full h-[75%] flex items-center justify-center overflow-hidden`}>
              <Image 
                source={tripDetails?.image}
                style={{
                    width: 90,
                    height: 90,
                    resizeMode: "contain",
                }}
                className={``}
              />
              <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-2xl`}>{tripDetails?.title}</Text>
              <View className={`flex flex-row items-center justify-center`}>
                <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} font-thin text-[12px]`}>{travelTimeInformation?.duration?.text}</Text>
                <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} font-thin`}> - </Text>
                <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} font-thin text-[12px]`}>{travelTimeInformation?.distance?.text}</Text>
              </View>
            </View>
            <View className={`w-full h-[25%] border-t-[0.25px] border-b-[0.25px] flex flex-row items-center ${props.theme === "dark" ? "border-gray-500" : "border-gray-300"}`}>
                <View className={`w-1/2 h-full flex items-center justify-center`}>
                  <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-gray-500" : "text-black"}`} >{price}</Text>
                </View>
                <View className={`border-l-[0.5px] h-[70%] ${props.theme === "dark" ? "border-gray-500" : "border-gray-300"}`}></View>
                <View className="w-1/2 h-full flex flex-row items-center justify-center">
                  <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} mr-2 text-lg`}>Cash</Text>
                  <Ionicons name='cash' size={25} color="green"/>
                </View>
            </View>
          </View>
        </View>
        <View className={`w-full h-[30%] flex items-center justify-start`}>
          <TouchableOpacity className={`w-[90%] mt-2 h-[65%] bg-red-600 rounded-2xl flex items-center justify-center shadow-xl`}>
              <Text style={{fontFamily: "os-xb"}} className={`text-white text-lg`}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RequestScreen;