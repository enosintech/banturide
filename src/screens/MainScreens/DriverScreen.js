import { View, Text, ScrollView, Dimensions, TouchableOpacity, Share, Image } from 'react-native'
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as SecureStore from "expo-secure-store";

import RequestMap from '../../components/atoms/RequestMap';
import PageLoader from '../../components/atoms/PageLoader';

import { clearChatMessages, selectBooking, selectDestination, selectDriver, selectLocationUpdatedRan, selectOrigin, selectPassThrough, selectPaymentMethod, selectPaymentMethodUpdated, selectRemaingTripDistance, selectRemainingTripTime, selectTripType, setBooking, setBookingRequested, setDeliveryType, setDestination, setDriver, setLocationUpdatedRan, setOrigin, setPassThrough, setPaymentMethodUpdated, setPrice, setRecipient, setRemainingTripDistance, setRemainingTripTime, setSearchComplete, setSearchPerformed, setTravelTimeInformation, setTripDetails } from '../../../slices/navSlice';
import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from '../../../slices/authSlice';

const  { width } = Dimensions.get("window");

const DriverScreen = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mapRef = useRef();
  const routes = useRoute();
  const height = Dimensions.get("window").height;

  const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const fontSize = width * 0.05;

  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination);
  const booking = useSelector(selectBooking);
  const driver = useSelector(selectDriver);
  const paymentMethod = useSelector(selectPaymentMethod);
  const tripType = useSelector(selectTripType);
  const locationUpdateRan = useSelector(selectLocationUpdatedRan);
  const tokens = useSelector(selectToken);
  const remainingTripDistance = useSelector(selectRemainingTripTime);
  const paymentMethodUpdated = useSelector(selectPaymentMethodUpdated);
  const isSignedIn = useSelector(selectIsSignedIn)

  const [ error, setError ] = useState(false);

  const { updatedPaymentMessage } = routes.params ? routes.params : "";

  const [ min, setMin ] = useState();

  const currentLocation = {
    latitude: origin?.location.lat,
    longitude: origin?.location.lng,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010
  }

  const goToCurrentLocation = () => {
    mapRef.current.animateToRegion(currentLocation, 1 * 1000);
  }

  const fitMarkers = () => {
    mapRef.current?.fitToSuppliedMarkers(['origin', 'driver' ], {
      edgePadding: {top: 100, right: 100, bottom: 50, left: 100}
    })
  }

  const formatTripDetails = (bookingDetails) => {
    return `
    🚗 *Trip Details* 🚗

    🛫 *Pickup Location:* ${bookingDetails?.pickUpLocation}
    🛬 *Dropoff Location:* ${bookingDetails?.dropOffLocation}
    `;
  };

  const shareTripDetails = async () => {
    const message = formatTripDetails(booking);

    try {
        await Share.share({
            message: message,
            title: "My Trip Details"
        });
    } catch (error) {
        const errorField = error.error || error.message;
        setError(errorField || "Error Sharing Trip")
        setTimeout(() => {
          setError(false)
        }, 3000)
    }
  };

  console.log(booking)

  const updateBookingLocation = async () => {
      console.log("trying booking");
      await fetch("https://banturide-api.onrender.com/location/update-booking-location", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokens?.idToken}`,
              'x-refresh-token' : tokens?.refreshToken,
          },
          body: JSON.stringify({
              bookingId: booking?.bookingId,
              driverId: booking?.driverId
          })
      }).then(response => response.json())
      .then(data => {
        if(data.success === false){
          throw new Error(data.error || data.message)
        } else {
          console.log(data);
        }
      })
      .catch( async (error) => {
        const errorField = error.message || error.error;

        if(errorField === "Unauthorized"){
          await SecureStore.deleteItemAsync("tokens")
          .then(() => {
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
          .catch(() => {
            setError("Something went wrong. Unauthorized")
            setTimeout(() => {
              setError(false)
            }, 3000)
          })
        } else {
          setError(errorField || "Something went wrong")
          setTimeout(() => {
            setError(false)
          }, 3000)
        }
      })
  }

  const updateDeliveryLocation = async () => {
    console.log("trying delivery");
    await fetch("https://banturide-api.onrender.com/location/update-delivery-location", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens?.idToken}`,
        'x-refresh-token' : tokens?.refreshToken,
      },
      body: JSON.stringify({
        deliveryId: booking?.bookingId,
        driverId: booking?.driverId
      })
    }).then(response => response.json())
    .then(data => {
      if(data.success === false){
        throw new Error(data.error || data.message)
      } else {
        console.log(data);
      }
    }).catch( async (error) => {
      const errorField = error.message || error.error;

      if(errorField === "Unauthorized"){
        await SecureStore.deleteItemAsync("tokens")
        .then(() => {
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
        .catch(() => {
          setError("Something went wrong. Unauthorized")
          setTimeout(() => {
            setError(false)
          }, 3000)
        })
      } else {
        setError(errorField || "Something went wrong")
        setTimeout(() => {
          setError(false)
        }, 3000)
      }
    })
  }

  useEffect(() => {
    if(!booking || booking?.status !== "confirmed") return ;

    const getDriverTime = async () => {
        fetch(
            `https://maps.googleapis.com/maps/api/directions/json?destination=${booking?.pickUpLocation?.latitude},${booking?.pickUpLocation?.longitude}&origin=${booking?.driverCurrentLocation[0]},${booking?.driverCurrentLocation[1]}&key=${api}`
        )
        .then((res) => res.json())
        .then(data => {
            setMin(parseInt(data?.routes[0]?.legs[0]?.duration?.text))
        });
    }

    getDriverTime();

  }, [booking, api])

  useEffect(() => {

    const getTripTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/directions/json?destination=${booking?.dropOffLocation?.latitude},${booking?.dropOffLocation?.longitude}&origin=${booking?.driverCurrentLocation[0]},${booking?.driverCurrentLocation[1]}&key=${api}`
      )
      .then((res) => res.json())
      .then(data => {
        console.log(data?.routes[0]?.legs[0]?.duration?.text, data?.routes[0]?.legs[0]?.distance?.text)
        dispatch(setRemainingTripTime(parseInt(data?.routes[0]?.legs[0]?.duration?.text)))
        dispatch(setRemainingTripDistance(parseInt(data?.routes[0]?.legs[0]?.distance?.text)))
      }) 
    }

    if(booking?.status === "ongoing"){
      console.log("called")
      getTripTime();
    }

  }, [booking, api])

  useEffect(() => {
    if(!locationUpdateRan && booking?.status === "confirmed" && booking?.bookingType === "ride"){
      updateBookingLocation();
      dispatch(setLocationUpdatedRan(true))
    }
  }, [locationUpdateRan, booking])

  useEffect(() => {
    if(!locationUpdateRan && booking?.status === "confirmed" && booking?.bookingType === "delivery"){
      updateDeliveryLocation();
      dispatch(setLocationUpdatedRan(true))
    }
  }, [locationUpdateRan, booking])

useEffect(() => {
  if(booking?.status !== "completed"){
    return
  }

  if(booking?.rated === false) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0, 
        routes: [
          { name: 'rateDriver' },
        ],
      })
    );
  } else {
    dispatch(setBooking(null))
    dispatch(setDriver(null))
    dispatch(setDestination(null))
    dispatch(setOrigin(null))
    dispatch(setPrice(null))
    dispatch(setTravelTimeInformation(null))
    dispatch(setTripDetails(null))
    dispatch(setPassThrough(null))
    dispatch(clearChatMessages())
    dispatch(setBookingRequested(false))
    dispatch(setSearchPerformed(false))
    dispatch(setSearchComplete(false))
    dispatch(setLocationUpdatedRan(false))
    navigation.dispatch(
      CommonActions.reset({
        index: 0, 
        routes: [
          { name: 'Home' },
        ],
      })
    );
  }


}, [booking])

  return (
    <View className={`w-full h-full`}>
      <View className={`w-full h-full relative flex ${props.theme === "dark" ? "bg-dark-main" : ""}`}>
          {paymentMethodUpdated &&
              <View className={`w-full h-[6%] absolute z-20 top-20 flex items-center justify-center`}>
                  <View className={`w-fit px-6 h-[90%] bg-black rounded-[50px] flex items-center justify-center`}>
                      <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-medium text-center tracking-tight">{updatedPaymentMessage}</Text>
                  </View>
              </View>
          }

          {error &&
              <View className={`w-full h-[6%] absolute z-20 top-20 flex items-center justify-center`}>
                  <View className={`w-fit px-6 h-[90%] bg-red-600 rounded-[50px] flex items-center justify-center`}>
                      <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-medium text-center tracking-tight">{error}</Text>
                  </View>
              </View>
          }

        <ScrollView contentContainerStyle={{
          display: "flex",
          flexDirection: "column"
        }}>
          <View style={{
            height: 0.7 * height
          }} className={`w-full relative`}>

            <TouchableOpacity className={`absolute z-50 bottom-[5%] right-[5%] rounded-2xl shadow-sm ${props.theme === "dark" ? "bg-dark-main" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.navigate("Home")
                }}>
                <Ionicons name="chevron-down" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[5%] rounded-2xl shadow-sm ${props.theme === "dark" ? "bg-dark-main" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrentLocation()}>
                    <MaterialIcons name="my-location" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[18%] rounded-2xl shadow-sm ${props.theme === "dark" ? "bg-dark-main" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => fitMarkers()}>
                    <MaterialCommunityIcons name="arrow-expand" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>
            <RequestMap mapRef={mapRef} theme={props.theme}/>
          </View>
          <View style={{
            height: 0.8 * height
          }} className={`w-full flex items-center justify-start gap-y-4 border-t-4 ${props.theme === "dark" ? "bg-dark-main border-white" : "bg-gray-100 border-gray-200"}`}>
            <View className={`w-[95%] h-[20%] rounded-[40px] shadow-sm flex flex-row items-center ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"}`}>
              <View className={`w-2/3 h-full flex-row`}>
                <View className={`w-1/3 h-full flex items-center justify-start pt-7`}>
                  <View className={`w-14 h-14 rounded-full overflow-hidden ${props.theme === "dark" ? "bg-dark-secondary" : "bg-gray-100"}`}>
                    <Image 
                      source={driver?.avatar ? { uri: driver.avatar } : require("../../../assets/images/profileplaceholder.png")}
                      resizeMode={"contain"}
                      style={{
                        width: "100%",
                        height: "100%"
                      }}
                    />
                  </View>
                </View>
                <View className={`w-2/3 h-full flex items-start justify-center`}>
                  <Text style={{fontSize: fontSize}} className={`font-extrabold ${props.theme === "dark" ? "text-white" : "text-black "} tracking-tight`}>{driver?.firstname} {driver?.lastname}</Text>
                  <Text style={{fontSize: fontSize * 0.65}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>{driver?.carColor} {driver?.carManufacturer} {driver?.carModel}</Text>
                  <Text style={{fontSize: fontSize * 0.65}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>{driver?.vehicleReg}</Text>
                  <View className={`w-[95%] h-[20%] mt-2 rounded-[20px] bg-[#186f65] flex items-center justify-center overflow-hidden`}>
                    {min 
                    ?
                      <Text style={{fontSize: fontSize * 0.65}} className={`text-white font-bold tracking-tight`}>{booking?.status === "ongoing" ? "You're on the way" : booking?.driverArrivedAtPickup ? "Driver has Arrived" : min > 2  ? `Arriving in ${min} mins` : "Arriving Soon"}</Text>
                    :
                    booking?.status === "ongoing"
                    ?
                      <Text style={{fontSize: fontSize * 0.65}} className={`text-white font-bold tracking-tight`}>{remainingTripDistance} Minutes Left</Text>
                    :
                    booking?.status === "arrived"
                    ?
                      <Text style={{fontSize: fontSize * 0.65}} className={`text-white font-bold tracking-tight`}>You have arrived</Text>
                    :
                      <PageLoader theme={props.theme} />
                    }
                  </View>
                </View>
              </View>
              <View className={`w-1/3 h-full flex items-center justify-center`}>
                <TouchableOpacity disabled={booking?.rated === true ? true : false} className={`w-[85%] h-[85%] flex items-center justify-center rounded-[30px] shadow-sm ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border-[0.5px] border-gray-100"}`} onPress={() => {
                  booking?.bookingType === "ride" &&  (booking?.status === "ongoing" || booking?.status === "arrived") 
                  ? 
                    navigation.navigate("rateDriver")
                  :
                  navigation.navigate("chat");
                }}>
                  {
                    booking?.bookingType === "ride" &&  (booking?.status === "ongoing" || booking?.status === "arrived") 
                    ?
                    booking?.rated === true ?
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <MaterialIcons name="star-rate" size={fontSize * 1.75} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontSize: fontSize * 1.1}} className={`font-black tracking-tight mt-3 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>{driver?.driverRating.toFixed(2)}</Text>
                    </View>
                    :
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <MaterialIcons name="star-rate" size={fontSize * 1.75} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontSize: fontSize * 0.65}} className={`font-semibold tracking-tight mt-1 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Rate Ride</Text>
                    </View>
                    :
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <Ionicons name="chatbubbles" size={fontSize * 1.75} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontSize: fontSize * 0.65}} className={`font-semibold tracking-tight mt-1 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Contact Driver</Text>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View className={`w-[95%] h-[40%] rounded-[40px] shadow-sm flex items-center justify-center ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"}`}>
              <View className={`w-[90%] flex items-center justify-between h-[90%]`}>
                <View className={`w-full h-1/3 flex-row items-center rounded-[50px] shadow-sm ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border-[0.5px] border-gray-100"}`}>
                  <View className={`w-[20%] h-full flex items-center justify-center translate-x-1`}>
                    <MaterialIcons name="trip-origin" size={fontSize * 1.65} color={props.theme === "dark" ? "white" : "black"}/>
                  </View>
                  <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                  <View className={`w-[80%] h-full flex items-center pr-8`}>
                    <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                      <Text style={{fontSize: fontSize * 1.3}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Origin</Text>
                    </View>
                    <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                      <Text style={{fontSize: fontSize * 0.9}} className={`tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{origin?.description.split(",")[0]}</Text>
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
                          <View className={`w-full h-full flex items-center justify-center`}>
                            <View className={`w-full h-1/2 flex flex-row items-center justify-center`}>
                              <MaterialIcons name="keyboard-arrow-right" size={fontSize * 1.3} color={props.theme === "dark" ? "white" : "black"}/>
                              <Text style={{fontSize: fontSize * 0.85}} className={`tracking-tight font-black ${props.theme === "dark" ? "text-white" : "text-black"}`}>Stop</Text>
                              <MaterialIcons name="keyboard-arrow-right" size={fontSize * 1.3} color={props.theme === "dark" ? "white" : "black"}/>
                            </View>
                            <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                            <Text numberOfLines={1} style={{fontSize: fontSize * 0.65}} className={`tracking-tight text-center w-[80%] mt-1 h-1/2 truncate ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                          </View>
                        </View>
                        :
                        <View className={`w-full h-1/2 flex items-center justify-center`}>
                          <View className={`p-3 opacity-30 rounded-full ${props.theme === "dark" ? "bg-dark-secondary border-gray-700" : "bg-white border-[0.5px] shadow-sm border-gray-100"}`}>
                            <Text style={{fontSize: fontSize * 0.65}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Stop</Text>
                          </View>
                        </View>
                      }
                      <View className={`w-full h-1/2 flex-row items-center rounded-[40px] ${props.theme === "dark" ? "bg-dark-secondary border-gray-700" : "bg-white border-[0.5px] border-gray-100"} shadow-sm`}>
                        <View className={`w-[20%] h-full flex items-center justify-center`}>
                          <FontAwesome name="flag-checkered" size={fontSize * 1.65} color={props.theme === "dark" ? "white" : "black"}/>
                        </View>
                        <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                        {/* {booking?.status === "confirmed" || booking?.status === "arrived"
                        ? */}
                          <View className={`w-[80%] h-full flex items-center pr-8`}>
                            <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                              <Text style={{fontSize: fontSize * 1.3}} className={`font-extrabold tracking-tight mr-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                            </View>
                            <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                              <Text style={{fontSize: fontSize * 0.9}} className={`tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
                            </View>
                          </View>
                        
                          {/* <TouchableOpacity className={`w-[80%] h-full flex items-center pr-8`} onPress={() => {
                            navigation.navigate("updateDestination")
                          }}>
                            <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                              <Text style={{fontSize: fontSize * 1.3}} className={`font-extrabold tracking-tight mr-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                              <Ionicons name="chevron-forward" size={fontSize * 1.1} color={props.theme === "dark" ? "white" : "black"} />
                            </View>
                            <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                              <Text style={{fontSize: fontSize * 0.9}} className={`tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
                            </View>
                          </TouchableOpacity> */}
                      </View>
                    </View>
                    :
                    <View className={`w-full h-2/3 flex bg-yellow-800`}></View>
                  }
              </View>
            </View>
            <View className={`w-[95%] h-[30%] flex flex-row items-center justify-evenly`}>
                  {
                    booking?.bookingType === "ride" && 
                      <View className={`flex flex-col items-center`}>
                        <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                          navigation.navigate("changePayment")
                        }}>
                          <View className={`w-[65px] h-[65px] rounded-full shadow-sm flex items-center justify-center ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"}`}>
                            {booking?.paymentMethod === "cash" 
                            ?
                            <Ionicons name="cash" size={fontSize * 1.6} color="green"/>
                            :
                            <Entypo name="wallet" size={fontSize * 1.6} color={props.theme === "dark" ? "white" : "black"} />
                            }
                          </View>
                        </TouchableOpacity>
                        <View className={`w-fit text-center flex flex-col items-center relative`}>
                          <Text style={{fontSize: fontSize * 0.65}} className={`tracking-tight mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Payment</Text>
                          <Text style={{fontSize: fontSize * 0.5}} className={`text-neutral-700 absolute -translate-y-1`}>{booking?.paymentMethod === "cash" ? "Cash" : "Mobile Money"}</Text>
                        </View>
                      </View>
                  }
              <View className={`flex flex-col items-center`}>
                <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={shareTripDetails}>
                  <View className={`w-[65px] h-[65px] rounded-full shadow-sm flex items-center justify-center ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"}`}>
                    <Ionicons name="share" size={fontSize * 1.6} color={props.theme === "dark" ? "white" : "black"}/>
                  </View>
                </TouchableOpacity>
                <View className={`w-fit text-center flex flex-col items-center justify-start`}>
                  <Text style={{fontSize: fontSize * 0.65}} className={`tracking-tight mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Share trip</Text>
                </View>
              </View>
              
                {/* booking?.status === "ongoing" || booking?.status === "arrived"
                ?
                <View className={`flex flex-col items-center`}>
                  <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                    navigation.navigate('reportDriver')
                  }}>
                    <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"}`}>
                      <MaterialIcons name="report" size={fontSize * 1.8} color={props.theme === "dark" ? "white" : "black"}/>
                    </View>
                  </TouchableOpacity>
                  <View className={`w-fit text-center flex flex-col items-center justify-start`}>
                    <Text style={{fontSize: fontSize * 0.65}} className={` mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Report Driver</Text>
                  </View>
                </View>
                : */}
                {booking?.status === "confirmed" && 
                  <View className={`flex flex-col items-center`}>
                    <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                      navigation.navigate("cancel");
                    }}>
                      <View className={`w-[65px] h-[65px] rounded-full shadow-sm flex items-center justify-center bg-red-100`}>
                        <Entypo name="cross" size={fontSize * 1.6} color={"rgb(239,68,68)"}/>
                      </View>
                    </TouchableOpacity>
                    <View className={`w-fit text-center flex flex-col items-center justify-start`}>
                      <Text style={{fontSize: fontSize * 0.65}} className={` mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Cancel Ride</Text>
                    </View>
                  </View>
                }
              
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default DriverScreen;
