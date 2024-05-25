import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

import { selectDestination, selectSeats, selectToggle, selectTravelTimeInformation, selectTripType, setSeats } from '../../../slices/navSlice';
import { setToggle, setTripDetails, setPrice } from '../../../slices/navSlice';

import PageLoader from '../../components/atoms/PageLoader';
import { deliveryData, rideData } from '../../constants';

const ChooseRide = (props) => {
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const tripType = useSelector(selectTripType);
  const destination = useSelector(selectDestination);
  const seats = useSelector(selectSeats);
  const toggle = useSelector(selectToggle);

  const [ selected, setSelected ] = useState(null);
  

  const SURGE_CHARGE_RATE = 1.5;

  return (
    <SafeAreaView className={`relative h-full w-full ${props.theme === "dark" ? "bg-[#0e1115]" : ""}`}>
      <View className={`w-full h-[12%] flex-row items-center border-b-[0.25px] justify-center`}>
          <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{toggle === "ride" ? "Select A Ride" : "Specify Recipient"} - </Text>
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
      </View>
      {
          toggle === "ride"
          ?
          <View className={`w-full h-[76%] flex`}>
              {
                rideData.map((data, index) => (
                    <View key={data.id} index={index} {...data} className={`w-full h-1/3 flex items-center justify-center`}>
                        <TouchableOpacity className={`w-[95%] h-[95%] rounded-[20px] flex flex-row ${selected ? selected === data ? "opacity-100" : "opacity-60"  : "opacity-100" } ${selected === data && props.theme === "dark" ? "bg-[#3b434e]" : selected === data && props.theme !== "dark" ? "bg-white" : "" }`} onPress={() => {
                            setSelected(data)
                            dispatch(setSeats("4"));
                            dispatch(setTripDetails(data))
                            dispatch(setPrice(new Intl.NumberFormat("en-zm", {
                                      style: "currency",
                                      currency: "ZMW",
                                  }).format(
                                    (travelTimeInformation.length > 1 ? (travelTimeInformation[0].duration.value + travelTimeInformation[1].duration.value) * SURGE_CHARGE_RATE * data.multiplier / 100  : travelTimeInformation[0].duration.value * SURGE_CHARGE_RATE * data.multiplier / 100)
                                  )))
                        }}>
                            <View className={`w-[25%] h-full flex items-center justify-center`}>
                                <Image 
                                    source={data.image}
                                    style={{
                                        objectFit: "contain",
                                        width :65,
                                        height: 65,
                                    }}
                                />
                            </View>
                            <View className={`w-[50%] h-full flex`}>
                                <View className={`w-full h-1/2 flex items-center justify-center`}>
                                    <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{data.title}</Text>
                                </View>
                                <View className={`w-full h-1/2 flex-row items-center justify-evenly`}>
                                    <TouchableOpacity disabled={selected === data ? false : true} className={`px-3 py-2 ${seats === "4" && selected === data ? "bg-[#186f65]" : "bg-white shadow border border-gray-100"} rounded-full ${selected === data ? "opacity-100" : "opacity-30"}`} onPress={() => {
                                        dispatch(setSeats("4"));
                                    }}>
                                        <Text style={{fontFamily: "os-light"}} className={`${seats === "4" && selected === data ? "text-white" : "text-black"}`}>4 seats</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={selected === data ? false : true} className={`py-2 px-3 ${seats !== "4" && selected === data ? "bg-[#186f65]" : "bg-white shadow border border-gray-100"} rounded-full ${selected === data ? "opacity-100" : "opacity-30"}`} onPress={() => {
                                        if(data.id === "BantuEconomy"){
                                            dispatch(setSeats("6"))
                                        } else {
                                            dispatch(setSeats("6 - 12"))
                                        }
                                    }}>
                                        <Text style={{fontFamily: "os-light"}} className={`${seats !== "4" && selected === data ? "text-white" : "text-black"}`}>{data.id === "BantuEconomy" ? "6 seats" : "6 - 12 seats"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className={`w-[25%] h-full flex items-center`}>
                                <View className="w-full h-1/2 flex items-center justify-center">
                                    {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontFamily: "os-xb"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-gray-700"}`}>
                                                    {
                                                        new Intl.NumberFormat("en-zm", {
                                                            style: "currency",
                                                            currency: "ZMW",
                                                        }).format(
                                                            (travelTimeInformation.length > 1 ? (travelTimeInformation[0].duration.value + travelTimeInformation[1].duration.value) * SURGE_CHARGE_RATE * data.multiplier / 100  : travelTimeInformation[0].duration.value * SURGE_CHARGE_RATE * data.multiplier / 100)
                                                        )
                                                    }
                                                </Text>
                                            :
                                                <PageLoader theme={props.theme} width={"80%"} height={"70%"}/>
                                        :
                                            <Text style={{fontFamily: "os-xb"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-gray-700"}`}>{"K 0.01"}</Text>
                                    }
                                </View>
                                <View className={`w-[85%] h-0 border-t ${selected === data ? "block" : "hidden"} ${props.theme === "dark" ? "border-black" : "border-gray-300"}`}></View>
                                <View className={`w-full h-1/2 flex items-center justify-center`}>
                                    {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontFamily: "os-mid"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>
                                                    {travelTimeInformation.length > 1 ? parseInt(travelTimeInformation[0].duration.text) + parseInt(travelTimeInformation[1].duration.text) : parseInt(travelTimeInformation[0].duration.text)} Mins
                                                </Text>
                                            :
                                                <PageLoader theme={props.theme} width={"60%"} height={"40%"}/>
                                        :
                                            <View className={'w-full h-full bg-red-500'}></View>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
              }
          </View>
          :
          <View className={`w-full h-[76%] flex-col`}>
            <View className="w-full h-1/2 flex flex-row">
              {deliveryData.map((item, index) => (
                <View key={item.id} className={`w-1/3 h-full flex items-center justify-center`}>
                    <TouchableOpacity className="w-[85%] h-[85%] bg-white rounded-[20px]" onPress={() => {
                        setSelected(item);
                        dispatch(setTripDetails(item));
                    }}></TouchableOpacity>
                </View>
              ))}                      
            </View>
            <View className="w-full h-1/2 flex px-2">
                <View className="w-full h-1/2 flex flex-row items-center justify-between">
                    <Ionicons name="location-sharp" size={40} color="#8B0000"/>
                    <Text style={{fontFamily: "os-sb"}} className="truncate text-3xl">{destination.description.split(",").shift()}</Text>
                </View>
                <View className="w-full h-1/2 flex flex-row items-center justify-between">
                    <Text style={{fontFamily: "os-b"}} className="text-2xl text-gray-800">Recipient</Text>
                    <TouchableOpacity className="flex-row items-center gap-2">
                        <Text style={{fontFamily: "os-sb"}} className="text-xl text-gray-500">Enos</Text>
                        <Ionicons name="chevron-forward" size={30} color={"rgb(107,114,128)"} />
                    </TouchableOpacity>
                </View>
            </View>  
          </View>
      }
      <View className={`absolute bottom-7 border-t-[0.25px] w-full h-[12%] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} items-center`}>
          <View className={`h-full w-[50%] flex-row items-center justify-center`}>
              
          </View>
          <TouchableOpacity className={`absolute right-5 top-[20%] h-[35px] rounded-full w-[35px] ${props.theme === "dark" ? "bg-white" : "bg-black"} ${travelTimeInformation && selected ? "opacity-100" : "opacity-25"} flex items-center justify-center`} disabled={travelTimeInformation && selected ? false : true} onPress={() => {
            navigation.navigate("confirmscreen")
          }}>
              <Ionicons name="md-checkmark-sharp" size={20} color={`${props.theme === "dark" ? "black" : "white"}`} />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChooseRide;
