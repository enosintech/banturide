import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { selectBooking, selectDriver, selectTripDetails, setBooking, setBookingRequested, setDestination, setDriver, setLocationUpdatedRan, setOrigin, setPassThrough, setPrice, setSearchComplete, setSearchPerformed, setTravelTimeInformation, setTripDetails } from '../../../slices/navSlice';
import { useEffect, useState } from 'react';
import { ratingPerks } from '../../constants';

const { width } = Dimensions.get("window");

const RateDriver = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const fontSize = width * 0.05;

    const driver = useSelector(selectDriver);
    const booking = useSelector(selectBooking);
    const tripDetails = useSelector(selectTripDetails);

    const [ rating, setRating ] = useState();
    const [ comments, setComments ] = useState([]);

    const handleSkipRating = () => {
        dispatch(setBooking(null))
        dispatch(setDriver(null))
        dispatch(setDestination(null))
        dispatch(setOrigin(null))
        dispatch(setPrice(null))
        dispatch(setTravelTimeInformation(null))
        dispatch(setTripDetails(null))
        dispatch(setPassThrough(null))
        dispatch(setBookingRequested(false))
        dispatch(setSearchPerformed(false))
        dispatch(setSearchComplete(false))
        dispatch(setLocationUpdatedRan(false))
        navigation.navigate("Home")
    }

    const handleRateDriver = () => {
        console.log(`driver Rated with a rating of ${rating}. The following things were also said about the driver and their car. `)
    }

  return (
    <SafeAreaView className={`${props.theme === "dark" ? "bg-dark-primary" : ""} flex-1 flex`}>
      <View className={`w-full h-[10%] flex flex-row items-center px-4`}>
        <MaterialIcons name="star-rate" size={fontSize * 2} color={props.theme === "dark" ? "white" : "black"}/>
        <Text style={{fontSize: fontSize * 1.5}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Rate Driver</Text>
      </View>
      <View className={`w-full h-[20%] flex items-center justify-center`}>
        <View className={`w-[95%] h-[85%] rounded-[40px] shadow-sm flex flex-row items-center ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border border-gray-100"}`}>
            <View className={`w-1/2 h-full flex flex-col justify-center items-center`}>
                <Image 
                    source={tripDetails?.image}
                    style={{
                        width: 90,
                        height: 90,
                        overflow: "visible",
                    }}
                />
                <Text style={{fontSize : fontSize * 0.75}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>{tripDetails?.title}</Text>
            </View>
            <View className={`w-0 h-[80%] border ${props.theme === "dark" ? "border-white" : "border-gray-300"}`}></View>
            <View className={`w-1/2 h-full flex flex-row items-center justify-between pl-3 pr-5`}>
                <View className={`w-14 h-14 rounded-full bg-black`}></View>
                <View>
                    <Text style={{fontSize: fontSize * 0.85}} className={`font-extrabold ${props.theme === "dark" ? "text-white" : "text-black "} tracking-tight`}>{driver?.firstname} {driver?.lastname}</Text>
                    <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Red Toyota Prius</Text>
                    <Text style={{fontSize: fontSize * 0.65}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>BAE 3155</Text>
                </View>
            </View>
        </View>
      </View>
      <View className={`w-full h-[20%] flex items-center justify-center`}>
        <Text style={{fontSize: fontSize * 0.8}} className={`font-medium tracking-tight`}>How many stars for this ride?</Text>
        <View className={`flex flex-row mt-3`}>
            {[1,2,3,4,5].map((star, idx) => (
                <TouchableOpacity key={star} className={`flex items-center`} onPress={() => {
                    setRating(star)
                }}>
                    <MaterialIcons name={rating === undefined ? "star-outline" : rating >= star ? "star" : "star-outline" } size={fontSize * 3} color={props.theme === "dark" ? "white" : "black"} />
                    <Text style={{fontSize: fontSize }} className={`mt-3 font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{star}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>
      <View className={`w-full h-[35%] flex flex-row justify-evenly flex-wrap`} style={{alignItems: "center"}}>
            {ratingPerks.map((item, idx) => (
                <TouchableOpacity key={item.id} disabled={comments.includes(item.title)} className={`w-[30%] h-[40%] mb-5 pl-2 ${comments.includes(item.title) ? "opacity-40" : "opacity-100"} ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border border-gray-100"} rounded-[20px] shadow-sm flex`} onPress={() => {
                    if(comments.includes(item.title)){
                        console.log("item exists")
                        return;
                    }

                    setComments([...comments, item.title])
                }}>
                    <Image 
                        style={{
                            width: 70,
                            height: 70,
                            resizeMode: "contain"
                        }}
                    />
                    <Text style={{fontSize: fontSize * 0.8 }} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{item.title}</Text>
                </TouchableOpacity>
            ))}
      </View>
      <View className={`w-full h-[15%] flex flex-row items-center justify-evenly`}>
        <View className={`w-[95%] h-[85%] shadow-sm flex flex-row-reverse rounded-[40px] items-center justify-evenly ${props.theme === "dark" ? "bg-dark-secondary": "bg-white border border-gray-100"}`}>
            <TouchableOpacity disabled={rating === undefined ? true : false} className={`w-[45%] h-[70%] ${rating === undefined ? "opacity-40" : "opacity-100"} rounded-[40px] bg-[#186f65] flex items-center justify-center`} onPress={handleRateDriver}>
                <Text style={{fontSize: fontSize * 0.85}} className={`text-white font-extrabold tracking-tight`}>Rate Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity className={`w-[45%] h-[70%] rounded-[40px] bg-red-600 flex items-center justify-center`} onPress={() => {
                if(booking?.status !== "completed") {
                    navigation.goBack()
                } else {
                    handleSkipRating()
                }
            }}>
                <Text style={{fontSize: fontSize * 0.85}} className={`font-extrabold tracking-tight text-white`}>{booking?.status !== "completed" ? "Go Back" : "Skip Rating"}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RateDriver;