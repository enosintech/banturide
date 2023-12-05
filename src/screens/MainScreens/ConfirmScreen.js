import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

import { selectDestination, selectOrigin, selectPrice, selectToggle, selectTravelTimeInformation, selectTripDetails, selectBooking } from '../../../slices/navSlice';
import { setDestination, setOrigin, setPrice, setToggle, setTravelTimeInformation, setTripDetails, setBooking } from '../../../slices/navSlice';


const ConfirmScreen = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const toggle = useSelector(selectToggle);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const tripDetails = useSelector(selectTripDetails);
  const price = useSelector(selectPrice);

  return (
    <SafeAreaView className={`relative h-full w-full ${props.theme === "dark" ? "bg-[#0e1115]" : ""}`}>
      <View className={`relative w-full h-[12%] flex-row items-center border-b-[0.25px] justify-center`}>
        <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{toggle === "ride" ? "Trip Summary" : "Delivery Summary"} - {travelTimeInformation?.distance?.text}</Text>
        <TouchableOpacity className={`absolute left-2`} onPress={() => {
          navigation.goBack();
        }}>
          <Ionicons name='chevron-back' size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
      </View>
      <View className={`w-full h-[55%] flex justify-center items-center`}>
        <View className={`flex-row w-[90%] h-[90%] border-2 rounded-lg ${props.theme === "dark" ? "border-white" : "border-black"}`}>
          <View className={`relative w-[50%] h-full overflow-hidden flex flex-row justify-center pt-2`}>
            <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-xl`}>{tripDetails?.title}</Text>
            <Text style={{fontFamily: "os-b"}} className={`absolute right-2 top-12 text-[40px] opacity-40 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{price}</Text>
            <Image source={tripDetails?.image} 
                    style={{
                      width: 150,
                      height: 150,
                      resizeMode: "contain",
                    }}
                    className={`absolute -bottom-8 -left-8`}

            />
          </View>
          <View className={`w-[50%] h-full`}>
            <View className={`h-[80%] w-full p-2 flex items-start justify-start overflow-hidden`}>
                <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-lg`}>{origin?.description.split(",")[0]}</Text>
                <Text style={{fontFamily: "os-xb"}} className={`text-gray-500 text-[15px]`}>to</Text>
                <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-lg`}>{destination?.description.split(",")[0]}</Text>
            </View>
            <View className={`h-[20%] w-full flex items-center justify-center`}>
              <View className={`w-[80%] h-[60%] flex flex-row items-center justify-evenly`}>
                  <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation?.duration?.text}</Text>
                  <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>-</Text>
                  <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation?.distance?.text}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={`absolute bottom-10 w-full h-[30%] flex-row items-center justify-evenly px-3`}>
        <TouchableOpacity className={`h-[60px] w-[150px] rounded-2xl bg-red-600 shadow flex items-center justify-center`} onPress={() => {
          dispatch(setDestination(null))
          dispatch(setOrigin(null))
          dispatch(setPrice(null))
          dispatch(setTravelTimeInformation(null))
          dispatch(setTripDetails(null))
          navigation.navigate("Home")
        }}>
          <Text style={{fontFamily: "os-sb"}} className={`text-white text-[16px]`}>Cancel Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`h-[60px] w-[150px] rounded-2xl shadow bg-[#186f65] flex items-center justify-center`} onPress={() => {
          dispatch(setBooking(true))
          navigation.replace("RequestNavigator")
        }}>
          <Text style={{fontFamily: "os-sb"}} className={`text-white text-[16px]`}>Make Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ConfirmScreen;