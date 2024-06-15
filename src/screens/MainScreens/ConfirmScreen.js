import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';

import PageLoader from '../../components/atoms/PageLoader';

import { selectDestination, selectOrigin, selectPrice, selectToggle, selectTravelTimeInformation, selectTripDetails, selectBooking, selectSchoolPickup, selectTripType, selectPassThrough, setPassThrough, selectSeats, setBookingRequestLoading } from '../../../slices/navSlice';
import { setDestination, setOrigin, setPrice, setToggle, setTravelTimeInformation, setTripDetails, setBooking } from '../../../slices/navSlice';
import { selectUserInfo } from '../../../slices/authSlice';

const ConfirmScreen = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const toggle = useSelector(selectToggle);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const passThrough = useSelector(selectPassThrough);
  const tripDetails = useSelector(selectTripDetails);
  const tripType = useSelector(selectTripType);
  const price = useSelector(selectPrice);
  const seats = useSelector(selectSeats);
  const schoolPickup = useSelector(selectSchoolPickup);
  const userInfo = useSelector(selectUserInfo);

  const requestForm = {
    user: userInfo ? userInfo._id : "",
    price: parseFloat(price?.replace(/[K]/g, "")),
    hasThirdStop: passThrough ? true : false,
    thirdStopLatitude: passThrough ? passThrough.location.lat : "",
    thirdStopLongitude: passThrough ? passThrough.location.lng : "",
    pickUpLatitude: origin.location.lat,
    pickUpLongitude: origin.location.lng,
    dropOffLatitude: destination.location.lat,
    dropOffLongitude: destination.location.lng,
  }

  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestForm)
  }

  const handleMakeRequest = async () => {
    dispatch(setBookingRequestLoading(true));
    await fetch("https://banturide.onrender.com/bookride/book-request", options)
    .then(response => response.json())
    .then(data => {
      if(data.success === false){
        dispatch(setBookingRequestLoading(false))
        console.log(data.message)
      } else {
        dispatch(setBookingRequestLoading(false))
        dispatch(setBooking(data))
        navigation.navigate("Home")
      }
    })
  }

  return (
    <SafeAreaView className={`relative h-full w-full flex items-center ${props.theme === "dark" ? "bg-[#0e1115]" : ""}`}>
      <View className={`relative w-full h-[12%] flex-row items-center border-b-[0.25px] justify-center`}>
        <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{toggle === "ride" ? "Trip Summary" : "Delivery Summary"} - </Text>
        {tripType === "normal"
        ?
          travelTimeInformation  
          ?
              <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text)} KM</Text>
          :
              <PageLoader theme={props.theme} width={"15%"} height={"50%"}/>
        :
          <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>Chaffeur</Text>
        }
        <TouchableOpacity className={`absolute left-2`} onPress={() => {
          navigation.goBack();
        }}>
          <Ionicons name='chevron-back' size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
      </View>
      <View className={`w-full h-[55%] flex justify-center items-center`}>
        <View className={`flex-row w-[90%] h-[90%] shadow-md rounded-[20px] ${props.theme === "dark" ? "bg-[#3e454f]" : "bg-white"}`}>
          <View className={`w-1/2 h-full flex items-center`}>
            <View className={`w-full h-1/2 overflow-hidden relative flex items-center justify-center`}>
              <Image 
                source={tripDetails?.image}
                style={{
                  width: 50,
                  height : 50,
                  overflow: "visible",
                }}
              />
              <Text style={{fontFamily: "os-xb"}} className={`text-[16px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{tripDetails?.title}</Text>
              <Text style={{fontFamily: "os-light"}} className={`text-[12px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{seats} Seater</Text>
            </View>
            <View className={`w-[80%] h-0 border-b ${props.theme === "dark" ? "border-white" : "border-gray-200"}`}></View>
            <View className={`w-full h-1/2 flex items-center`}>
              <View className={`w-full h-2/3 flex items-center justify-center`}>
                {price
                ?
                  <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-white" : "text-gray-700"} text-3xl`}>{price}</Text>                              
                :
                  <PageLoader theme={props.theme} width="60%" height="70%"/>
                }
              </View>
              <View className={`w-[75%] h-1/3 flex-row items-center justify-evenly`}>
                {tripType === "normal"
                  ?
                    travelTimeInformation  
                    ?
                        <Text style={{fontFamily: "os-light"}} className={`text-[14px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text)} KM</Text>
                    :
                        <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                  :
                    <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>Chaffeur</Text>
                }
                {tripType === "normal"
                  ?
                    travelTimeInformation  
                    ?
                        <Text style={{fontFamily: "os-light"}} className={`text-[14px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? parseInt(travelTimeInformation[0].duration.text) + parseInt(travelTimeInformation[1].duration.text) : parseInt(travelTimeInformation[0].duration.text)} Mins</Text>
                    :
                        <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                  :
                    <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>Mode</Text>
                }
              </View>
            </View>
          </View>
          <View className={`w-1/2 h-full flex items-center justify-center`}>
            <View className={`w-[90%] flex justify-between h-[90%]`}>
              <View className={`w-full h-1/3 flex-row items-center rounded-[16px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                <View className={`w-[30%] h-full flex items-center justify-center`}>
                  <MaterialIcons name="trip-origin" size={25} color={props.theme === "dark" ? "white" : "black"}/>
                </View>
                <View className={`w-0 h-[80%] border-l-[0.5px] ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                <View className={`w-[70%] h-full flex`}>
                  <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                    <Text style={{fontFamily: "os-xb"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Origin</Text>
                  </View>
                  <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                    <Text style={{fontFamily: "os-light"}} className={`text-[13px] ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{origin?.description.split(",")[0]}</Text>
                  </View>
                </View>
              </View>
                {
                  tripType === "normal"
                  ?
                  <View className={`w-full h-2/3 flex`}>
                    {
                      passThrough 
                      ?
                      <View className={`w-full h-1/2 flex-row`}>
                        <View className={`w-[60%] h-full flex items-center justify-center`}>
                          <View className={`w-full h-1/2 flex flex-row items-center justify-center`}>
                            <MaterialIcons name="keyboard-arrow-right" size={20} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Stop</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={20} color={props.theme === "dark" ? "white" : "black"}/>
                          </View>
                          <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                          <Text style={{fontFamily: "os-light"}} className={`text-[12px] w-[80%] mt-1 h-1/2 truncate ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                        </View>
                        <View className={`w-[40%] h-full flex items-center justify-center`}>
                          <TouchableOpacity className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`} onPress={() => {
                            dispatch(setPassThrough(null))
                          }}>
                            <Text style={{fontFamily: "os-mid"}} className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      :
                      <View className={`w-full h-1/2 flex items-center justify-center`}>
                        <TouchableOpacity className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`} onPress={() => {
                          navigation.navigate("addStop")
                        }}>
                          <Text style={{fontFamily: "os-mid"}} className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
                        </TouchableOpacity>
                      </View>
                    }
                    <View className={`w-full h-1/2 flex-row items-center rounded-[16px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                      <View className={`w-[30%] h-full flex items-center justify-center`}>
                        <FontAwesome name="flag-checkered" size={25} color={props.theme === "dark" ? "white" : "black"}/>
                      </View>
                      <View className={`w-0 h-[80%] border-l-[0.5px] ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                      <View className={`w-[70%] h-full flex`}>
                        <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                          <Text style={{fontFamily: "os-xb"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                        </View>
                        <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                          <Text style={{fontFamily: "os-light"}} className={`text-[13px] ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  :
                  <View className={`w-full h-2/3 flex bg-yellow-800`}></View>
                }
            </View>
          </View>
        </View>
      </View>
      <View className={`w-[90%] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white"} rounded-[20px] h-[30%] flex`}>
        <View className={`w-full h-1/3 flex items-center justify-end`}>
          <View className={`w-[90%] h-[75%] shadow border-[0.5px] rounded-full ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"}`}></View>
        </View>
        <View className={`w-full h-2/3 flex-row items-center`}>
          <TouchableOpacity className={`w-[18%] h-full flex items-center justify-center`} onPress={() => {
            navigation.navigate("togglePayment");
          }}>
            <Ionicons name="cash" size={30} color={"#186f65"}/>
          </TouchableOpacity>
          <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-white" : "border-gray-300"}`}></View>
          <View className={`w-[41%] h-full flex items-center justify-center`}>
            <TouchableOpacity className={`h-[80%] w-[90%] rounded-[20px] bg-red-600 shadow flex items-center justify-center`} onPress={() => {
              dispatch(setDestination(null))
              dispatch(setOrigin(null))
              dispatch(setPrice(null))
              dispatch(setTravelTimeInformation(null))
              dispatch(setTripDetails(null))
              navigation.navigate("Home")
            }}>
              <Text style={{fontFamily: "os-sb"}} className={`text-white text-[16px]`}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
          <View className={`w-[41%] h-full flex items-center justify-center`}>
            <TouchableOpacity className={`h-[80%] w-[90%] rounded-[20px] shadow bg-[#186f65] flex items-center justify-center`} onPress={handleMakeRequest}>
              <Text style={{fontFamily: "os-sb"}} className={`text-white text-[16px]`}>Make Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ConfirmScreen;