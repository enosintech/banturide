import { View, Text, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";

import PageLoader from '../../components/atoms/PageLoader';

import { selectDeliveryType, selectDestination, selectRecipient, selectSeats, selectToggle, selectTravelTimeInformation, selectTripType, setRecipient, setSeats } from '../../../slices/navSlice';
import { setTripDetails, setPrice } from '../../../slices/navSlice';

import { rideData } from '../../constants';

const { width } = Dimensions.get("window");

const ChooseRide = (props) => {
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const tripType = useSelector(selectTripType);
  const destination = useSelector(selectDestination);
  const seats = useSelector(selectSeats);
  const toggle = useSelector(selectToggle);
  const recipient = useSelector(selectRecipient);
  const deliveryType = useSelector(selectDeliveryType)

  const [ selected, setSelected ] = useState(null);

  const fontSize = width * 0.05;
  
  const SURGE_CHARGE_RATE = 1.5;

  return (
    <View className={`relative h-full w-full ${props.theme === "dark" ? "bg-dark-primary" : ""}`}>
      <View className={`w-full h-[12.5%] flex-row items-center justify-center`}>
          <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{toggle === "ride" ? "Select A Ride" : "Specify Recipient"} - </Text>
          {tripType === "normal"
          ?
            travelTimeInformation  
            ?
                <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text)} KM</Text>
            :
                <PageLoader theme={props.theme} width={"15%"} height={"50%"}/>
          :
            <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Chaffeur</Text>
          }
      </View>
      {
          toggle === "ride"
          ?
          <View className={`w-full h-[70%] flex`}>
              {
                rideData.map((data, index) => (
                    <View key={data.id} index={index} {...data} className={`w-full h-1/3 flex items-center justify-center`}>
                        <TouchableOpacity disabled={travelTimeInformation ? false : true} className={`w-[95%] h-[95%] rounded-[25px] shadow-sm flex flex-row ${travelTimeInformation ? selected ? selected === data ? "opacity-100" : "opacity-60"  : "opacity-100" : "opacity-40" } ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"}`} onPress={() => {
                            setSelected(data)
                            dispatch(setSeats("4"));
                            dispatch(setTripDetails(data))
                            dispatch(setPrice(new Intl.NumberFormat("en-zm", {
                                      style: "currency",
                                      currency: "ZMW",
                                  }).format(
                                    (travelTimeInformation?.length > 1 ? (travelTimeInformation[0]?.duration.value + travelTimeInformation[1]?.duration.value) * SURGE_CHARGE_RATE * data.multiplier / 100  : travelTimeInformation[0]?.duration.value * SURGE_CHARGE_RATE * data.multiplier / 100)
                                  )))
                        }}>
                            <View className={`w-[25%] h-full flex items-center justify-center`}>
                                <Image 
                                    source={data.image}
                                    style={{
                                        objectFit: "contain",
                                        width : 85,
                                        height: 85,
                                    }}
                                />
                            </View>
                            <View className={`w-[50%] h-full flex`}>
                                <View className={`w-full h-1/2 flex items-center justify-center`}>
                                    <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{data.title}</Text>
                                </View>
                                <View className={`w-full h-1/2 flex-row items-center justify-evenly`}>
                                    <TouchableOpacity disabled={selected === data ? false : true} className={`px-3 py-2 ${seats === "4" && selected === data ? "bg-[#186f65]" : "bg-white shadow border border-gray-100"} rounded-full ${selected === data ? "opacity-100" : "opacity-30"}`} onPress={() => {
                                        dispatch(setSeats("4"));
                                    }}>
                                        <Text style={{fontSize: fontSize * 0.65}} className={`${seats === "4" && selected === data ? "text-white" : "text-black"} font-light`}>4 seats</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={selected === data ? false : true} className={`py-2 px-3 ${seats !== "4" && selected === data ? "bg-[#186f65]" : "bg-white shadow border border-gray-100"} rounded-full ${selected === data ? "opacity-100" : "opacity-30"}`} onPress={() => {
                                        if(data.id === "BantuEconomy"){
                                            dispatch(setSeats("6"))
                                        } else {
                                            dispatch(setSeats("6 - 12"))
                                        }
                                    }}>
                                        <Text style={{fontSize: fontSize * 0.65}} className={`${seats !== "4" && selected === data ? "text-white" : "text-black"} font-light`}>{data.id === "BantuEconomy" ? "6 seats" : "6 - 12 seats"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className={`w-[25%] h-full flex items-center`}>
                                <View className="w-full h-1/2 flex items-center justify-center">
                                    {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text style={{fontSize: fontSize}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-gray-700"}`}>
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
                                            <Text style={{fontSize: fontSize}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-gray-700"}`}>{"K 0.01"}</Text>
                                    }
                                </View>
                                <View className={`w-[85%] h-0 border-t ${selected === data ? "block" : "hidden"} ${props.theme === "dark" ? "border-white" : "border-gray-300"}`}></View>
                                <View className={`w-full h-1/2 flex items-center justify-center`}>
                                    {tripType === "normal"
                                        ?
                                            travelTimeInformation  
                                            ?
                                                <Text className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>
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
          <View className={`w-full h-[70%] flex-col`}>
            <View className="w-full h-full flex items-center justify-center">
                <View className={`${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"} px-3 w-[90%] h-[90%] rounded-[40px] shadow-sm flex items-center`}>
                    <View className={`w-full h-1/3 flex flex-row items-center justify-between`}>
                        <Text style={{fontSize: fontSize }} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Recipient Name</Text>
                        <TextInput 
                            style={{ fontSize: fontSize * 0.9}}
                            className={`w-1/2 h-full font-medium tracking-tight text-right ${props.theme === "dark" ? "text-white" : "text-black"}`}
                            placeholder={"Enter Name"}
                            placeholderTextColor={"#d1d5db"}
                            defaultValue={recipient?.recipientFullName}
                            onChangeText={(x) => dispatch(setRecipient({
                                ...recipient,
                                recipientFullName: x
                            }))}
                        />
                    </View>
                    <View className={`w-full h-0 border-[0.5px] ${props.theme === "dark" ? "border-white" : "border-gray-300"} `}></View>
                    <View className={`w-full h-1/3 flex flex-row items-center justify-between`}>
                        <Text style={{fontSize: fontSize }} className={`font-extrabold tracking-tight w-1/2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Contact Number</Text>
                        <TextInput 
                            style={{ fontSize: fontSize * 0.9}}
                            className={`w-1/2 h-full font-medium tracking-tight text-right ${props.theme === "dark" ? "text-white" : "text-black"}`}
                            placeholder={"Enter Number"}
                            placeholderTextColor={"#d1d5db"}
                            defaultValue={recipient?.recipientContact}
                            onChangeText={(x) => dispatch(setRecipient({
                                ...recipient,
                                recipientContact: x
                            }))}
                            keyboardType={"numeric"}
                        />
                    </View>
                    <View className={`w-full h-0 border-[0.5px] ${props.theme === "dark" ? "border-white" : "border-gray-300"} `}></View>
                    <View className={`w-full h-[32%] flex items-center justify-center`}>
                        <View className={`w-[40%] h-[50%] bg-neutral-100 shadow-sm rounded-full flex flex-row items-center`}>
                            <Image 
                                source={deliveryType?.image}
                                style={{
                                    width: 45,
                                    height: 45,
                                    resizeMode: 'contain',
                                }}
                            />
                            <Text style={{fontSize: fontSize * 0.6}} className={`font-bold tracking-tighter`}>{deliveryType?.title}</Text>
                        </View>
                    </View>
                </View>
            </View>
          </View>
      }
      <View className={`w-full h-[17.5%] items-center`}>
          <View className={`h-full w-[50%] flex-row items-center justify-center`}>
              
          </View>
          <TouchableOpacity style={{ width: fontSize * 1.8, height: fontSize * 1.8 }} className={`absolute right-5 top-[20%] rounded-full ${props.theme === "dark" ? "bg-white" : "bg-black"} flex items-center justify-center ${toggle === "delivery" ? Object.values(recipient ? recipient : {}).includes("") || !recipient?.recipientFullName || !recipient?.recipientContact ? " opacity-25" : "opacity-100" : travelTimeInformation && selected ? "opacity-100" : "opacity-25" }`}  disabled={toggle === "delivery" ? Object.values(recipient ? recipient : {} ).includes("") ? true : false : travelTimeInformation && selected ? false : true } onPress={() => {
            navigation.navigate("confirmscreen")
          }}>
              <Ionicons name="md-checkmark-sharp" size={fontSize} color={`${props.theme === "dark" ? "black" : "white"}`} />
          </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChooseRide;
