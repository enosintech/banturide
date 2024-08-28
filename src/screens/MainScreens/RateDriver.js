import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation, } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";

import { clearChatMessages, selectBooking, selectDeliveryType, selectDriver, selectTripDetails, setBooking, setBookingRequested, setBookingRequestLoading, setDeliveryType, setDestination, setDriver, setLocationUpdatedRan, setOrigin, setPassThrough, setPrice, setRecipient, setSearchComplete, setSearchPerformed, setTravelTimeInformation, setTripDetails } from '../../../slices/navSlice';
import { useState } from 'react';
import { deliveryRatingPerks, ratingPerks } from '../../constants';
import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from '../../../slices/authSlice';
import LoadingBlur from '../../components/atoms/LoadingBlur';

const { width } = Dimensions.get("window");

const RateDriver = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const fontSize = width * 0.05;

    const driver = useSelector(selectDriver);
    const booking = useSelector(selectBooking);
    const tokens = useSelector(selectToken);
    const tripDetails = useSelector(selectTripDetails);
    const deliveryType = useSelector(selectDeliveryType);
    const isSignedIn = useSelector(selectIsSignedIn);

    const [ rating, setRating ] = useState();
    const [ comments, setComments ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const handleSkipRating = () => {
        dispatch(setBooking(null))
        dispatch(setDriver(null))
        dispatch(setDestination(null))
        dispatch(setOrigin(null))
        dispatch(setPrice(null))
        dispatch(setTravelTimeInformation(null))
        dispatch(setTripDetails(null))
        dispatch(setPassThrough(null))
        dispatch(setDeliveryType(null))
        dispatch(setRecipient(null))
        dispatch(clearChatMessages())
        dispatch(setBookingRequested(false))
        dispatch(setSearchPerformed(false))
        dispatch(setSearchComplete(false))
        dispatch(setLocationUpdatedRan(false))
        navigation.navigate("Home")
    }

    const handleRateDriver = async () => {
        setLoading(true)

        try {
            await fetch("https://banturide-api.onrender.com/reviews/add-ride-review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${tokens?.idToken}`,
                    "x-refresh-token" : tokens?.refreshToken,
                },
                body: JSON.stringify({
                    bookingId: booking?.bookingId,
                    driverId: booking?.driverId,
                    rating: rating,
                    comments: comments
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success === false) {
                    throw new Error(data.message || data.error)
                } else {
                    setLoading(false)

                    if(booking?.status !== "completed" ){
                        navigation.goBack();
                    } else {
                        dispatch(setBooking(null))
                        dispatch(setDriver(null))
                        dispatch(setDestination(null))
                        dispatch(setOrigin(null))
                        dispatch(setPrice(null))
                        dispatch(setTravelTimeInformation(null))
                        dispatch(setTripDetails(null))
                        dispatch(setPassThrough(null))
                        dispatch(setDeliveryType(null))
                        dispatch(setRecipient(null))
                        dispatch(clearChatMessages())
                        dispatch(setBookingRequested(false))
                        dispatch(setSearchPerformed(false))
                        dispatch(setSearchComplete(false))
                        dispatch(setLocationUpdatedRan(false))
                        navigation.navigate("Home")
                    }
                }
            })
        } catch (error) {
            const errorField = error.message || error.error;

            if(errorField === "Unauthorized"){
                await SecureStore.deleteItemAsync("tokens")
                .then(() => {
                setLoading(false)
                dispatch(setDestination(null))
                dispatch(setOrigin(null))
                dispatch(setPassThrough(null))
                dispatch(setPrice(null))
                dispatch(setTravelTimeInformation(null))
                dispatch(setTripDetails(null))
                dispatch(setDeliveryType(null))
                dispatch(setRecipient(null))
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setUserDataSet(false))
                dispatch(setGlobalUnauthorizedError("Please Sign in Again"))
                setTimeout(() => {
                    dispatch(setGlobalUnauthorizedError(false))
                }, 5000)
                })
                .catch((error) => {
                setLoading(false)
                setError("Error adding review. Unauthorized.") 
                setTimeout(() => {
                    setError(false)
                }, 3000)        
                })     
            } else {
                setLoading(false)
                setError(errorField || "Error adding delivery review")
                setTimeout(() => {
                    setError(false)
                })
            }
        }
    }

    const handleRateDeliveryDriver = async () => {
        setLoading(true)

        try {
            await fetch("https://banturide-api.onrender.com/reviews/add-delivery-review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${tokens?.idToken}`,
                    "x-refresh-token" : tokens?.refreshToken,
                },
                body: JSON.stringify({
                    deliveryId: booking?.bookingId,
                    driverId: booking?.driverId,
                    rating: rating,
                    comments: comments
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.sucess === false) {
                    throw new Error(data.message || data.error)
                } else {
                    setLoading(false)
                    dispatch(setBooking(null))
                    dispatch(setDriver(null))
                    dispatch(setDestination(null))
                    dispatch(setOrigin(null))
                    dispatch(setPrice(null))
                    dispatch(setTravelTimeInformation(null))
                    dispatch(setTripDetails(null))
                    dispatch(setPassThrough(null))
                    dispatch(setDeliveryType(null))
                    dispatch(setRecipient(null))
                    dispatch(clearChatMessages())
                    dispatch(setBookingRequested(false))
                    dispatch(setSearchPerformed(false))
                    dispatch(setSearchComplete(false))
                    dispatch(setLocationUpdatedRan(false))
                    navigation.navigate("Home")
                }
            })
        } catch (error) {
            const errorField = error.message || error.error;

            if(errorField === "Unauthorized"){
                await SecureStore.deleteItemAsync("tokens")
                .then(() => {
                setLoading(false)
                dispatch(setDestination(null))
                dispatch(setOrigin(null))
                dispatch(setPassThrough(null))
                dispatch(setPrice(null))
                dispatch(setTravelTimeInformation(null))
                dispatch(setTripDetails(null))
                dispatch(setDeliveryType(null))
                dispatch(setRecipient(null))
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setUserDataSet(false))
                dispatch(setGlobalUnauthorizedError("Please Sign in Again"))
                setTimeout(() => {
                    dispatch(setGlobalUnauthorizedError(false))
                }, 5000)
                })
                .catch((error) => {
                setLoading(false)
                setError("Error adding review. Unauthorized.") 
                setTimeout(() => {
                    setError(false)
                }, 3000)        
                })     
            } else {
                setLoading(false)
                setError(errorField || "Error adding delivery review")
                setTimeout(() => {
                    setError(false)
                })
            }
        }
    }

  return (
    <SafeAreaView className={`${props.theme === "dark" ? "bg-dark-primary" : ""} flex-1 flex relative`}>

        <LoadingBlur loading={loading} theme={props.theme} />

        { error &&
            <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                    <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof error === "string" ? error : "Server or Network Error Occurred"}</Text>
                </View>
            </View>
        }

      <View className={`w-full h-[10%] flex flex-row items-center px-4`}>
        <MaterialIcons name="star-rate" size={fontSize * 2} color={props.theme === "dark" ? "white" : "black"}/>
        <Text style={{fontSize: fontSize * 1.5}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Rate Driver</Text>
      </View>
      <View className={`w-full h-[20%] flex items-center justify-center`}>
        <View className={`w-[95%] h-[85%] rounded-[40px] shadow-sm flex flex-row items-center ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border border-gray-100"}`}>
            <View className={`w-1/2 h-full flex flex-col justify-center items-center`}>
                <Image 
                    source={booking?.bookingType === "ride" ? tripDetails?.image : deliveryType?.image}
                    style={{
                        width: 75,
                        height: 75,
                        overflow: "visible",
                    }}
                />
                <Text style={{fontSize : fontSize * 0.75}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>{booking?.bookingType === "ride" ? tripDetails?.title : deliveryType?.title}</Text>
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
        <Text style={{fontSize: fontSize * 0.8}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>How many stars for this ride?</Text>
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
      {booking?.bookingType === "ride" 
      ?
        <View className={`w-full h-[35%] flex flex-row justify-evenly flex-wrap`} style={{alignItems: "center"}}>
                {ratingPerks.map((item, idx) => (
                    <TouchableOpacity key={item.id} className={`w-[30%] h-[40%] mb-5 pl-2 ${comments.includes(item.title) ? "opacity-40" : "opacity-100"} ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border border-gray-100"} rounded-[20px] shadow-sm flex`} onPress={() => {
                        let updatedComments;

                        if(comments.includes(item.title)){
                            const newComments = comments.filter(comment => comment !== item.title)
                            updatedComments = newComments;
                        } else {
                            updatedComments = [...comments, item.title]
                        }

                        setComments(updatedComments);
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
      :
        <View className={`w-full h-[35%] flex flex-row justify-evenly flex-wrap`} style={{alignItems: "center"}}>
                    {deliveryRatingPerks.map((item, idx) => (
                        <TouchableOpacity key={item.id} className={`w-[30%] h-[40%] mb-5 pl-2 ${comments.includes(item.title) ? "opacity-40" : "opacity-100"} ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border border-gray-100"} rounded-[20px] shadow-sm flex`} onPress={() => {
                            let updatedComments;

                            if(comments.includes(item.title)){
                                const newComments = comments.filter(comment => comment !== item.title)
                                updatedComments = newComments;
                            } else {
                                updatedComments = [...comments, item.title]
                            }

                            setComments(updatedComments);
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
      }
      <View className={`w-full h-[15%] flex flex-row items-center justify-evenly`}>
        <View className={`w-[95%] h-[85%] shadow-sm flex flex-row-reverse rounded-[40px] items-center justify-evenly ${props.theme === "dark" ? "bg-dark-secondary": "bg-white border border-gray-100"}`}>
            <TouchableOpacity disabled={rating === undefined ? true : false} className={`w-[45%] h-[70%] ${rating === undefined ? "opacity-40" : "opacity-100"} rounded-[40px] bg-[#186f65] flex items-center justify-center`} onPress={booking?.bookingType === "ride" ? handleRateDriver : handleRateDeliveryDriver}>
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