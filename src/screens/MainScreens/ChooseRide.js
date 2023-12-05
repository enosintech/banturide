import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

import { selectToggle, selectTravelTimeInformation } from '../../../slices/navSlice';
import { setToggle, setTripDetails, setPrice } from '../../../slices/navSlice';

const ChooseRide = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const toggle = useSelector(selectToggle);

  const [ selected, setSelected ] = useState(null);

  const data = [
      {
          id: "BantuEconomy",
          title: "Bantu Economy",
          multiplier: 1,
          image: require("../../../assets/images/bantueconomy.png"),
      },
      {
          id: "BantuComfort",
          title: "Bantu Comfort",
          multiplier: 1.2,
          image: require("../../../assets/images/bantucomfort.png"),
      },
      {
          id: "BantuLuxury",
          title: "Bantu Deluxe",
          multiplier: 1.75,
          image: require("../../../assets/images/bantuluxury.png"),
      },
  ]

const SURGE_CHARGE_RATE = 1.5;

  return (
    <SafeAreaView className={`relative h-full w-full ${props.theme === "dark" ? "bg-[#0e1115]" : ""}`}>
      <View className={`w-full h-[12%] flex-row items-center border-b-[0.25px] justify-center`}>
          <Text style={{fontFamily: "os-b"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{toggle === "ride" ? "Select A Ride" : "Specify Cargo"} - {travelTimeInformation?.distance?.text}</Text>
      </View>
      {
          toggle === "ride"
          ?
          <View className={`w-full h-[76%]`}>
              <FlatList 
                  data={data}
                  keyExtractor={(item) => item.id}
                  renderItem={({item: {id, title, multiplier, image}, item}) => (
                      <TouchableOpacity className={`flex-row items-center justify-between pl-5 pr-5 ${id === selected?.id && props.theme === "dark" ? "bg-[#2d3645]" : id === selected?.id && props.theme === "light" ?  "bg-gray-300" : ""}`} onPress={() => {
                          setSelected(item)
                          dispatch(setTripDetails(item))
                          dispatch(setPrice(new Intl.NumberFormat("en-zm", {
                                      style: "currency",
                                      currency: "ZMW",
                                  }).format(
                                      (travelTimeInformation?.duration?.value * SURGE_CHARGE_RATE * multiplier) / 100
                                  )))
                      }}>
                          <Image 
                              style={{
                                  width: 100,
                                  height: 100,
                                  resizeMode: "contain",
                              }}
                              source={image}
                          />
                          <View className={`-ml-6`}>
                              <Text style={{fontFamily: "os-mid"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"} font-semibold`}>{title}</Text>
                              <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} font-thin`}>{travelTimeInformation?.duration?.text || "Travel Time"}</Text>
                          </View>
                          <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px]`}>
                              {
                                  new Intl.NumberFormat("en-zm", {
                                      style: "currency",
                                      currency: "ZMW",
                                  }).format(
                                      (travelTimeInformation?.duration?.value * SURGE_CHARGE_RATE * multiplier) / 100
                                  )
                              }
                          </Text>
                      </TouchableOpacity>
                  )}
              />
          </View>
          :
          <View className={`w-full h-[76%] bg-blue-500`}>

          </View>
      }
      <View className={`absolute bottom-7 border-t-[0.25px] w-full h-[12%] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} items-center`}>
          <View className={`h-full w-[50%] flex-row items-center justify-between`}>
              <TouchableOpacity className={`h-[80%] w-[40%] rounded-full items-center justify-center ${toggle === "ride" ? "bg-[#186F65]" : "bg-white"}`} onPress={() => {
                  dispatch(setToggle("ride"))
              }}>
                  <Text style={{fontFamily: "os-light"}} className={`${toggle === "ride" ? "text-white" : "text-black"} text-md`}>Ride</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`h-[80%] w-[40%] rounded-full items-center justify-center ${toggle === "delivery" ? "bg-[#186F65]" : "bg-white"}`} onPress={() => {
                  dispatch(setToggle("delivery"))
              }}>
                  <Text style={{fontFamily: "os-light"}} className={`${toggle === "delivery" ? "text-white" : "text-black"} text-md`}>Delivery</Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity className={`absolute right-5 top-[10%] h-[35px] rounded-full w-[35px] ${props.theme === "dark" ? "bg-white" : "bg-black"} ${!selected ? "opacity-25" : "opacity-100"} flex items-center justify-center`} disabled={!selected} onPress={() => {
            navigation.navigate("confirmscreen")
          }}>
              <Ionicons name="md-checkmark-sharp" size={20} color={`${props.theme === "dark" ? "black" : "white"}`} />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChooseRide;
