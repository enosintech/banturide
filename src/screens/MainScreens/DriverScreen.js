import { View, Text, ScrollView, Dimensions, TouchableOpacity, PixelRatio } from 'react-native'
import { useEffect, useRef, useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import RequestMap from '../../components/atoms/RequestMap';
import { selectBooking, selectDestination, selectDriver, selectHasArrived, selectLocationUpdatedRan, selectOnTheWay, selectOrigin, selectPassThrough, selectPaymentMethod, selectTripType, setLocationUpdatedRan, setPassThrough, setRemainingTripDistance, setRemainingTripTime } from '../../../slices/navSlice';
import PageLoader from '../../components/atoms/PageLoader';
import { selectToken } from '../../../slices/authSlice';

const DriverScreen = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mapRef = useRef();
  const height = Dimensions.get("window").height;

  const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const fontScale = PixelRatio.getFontScale();

  const getFontSize = size => size / fontScale;

  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination);
  const booking = useSelector(selectBooking);
  const driver = useSelector(selectDriver);
  const paymentMethod = useSelector(selectPaymentMethod);
  const tripType = useSelector(selectTripType);
  const locationUpdateRan = useSelector(selectLocationUpdatedRan);
  const tokens = useSelector(selectToken);

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
      edgePadding: {top: 100, right: 200, bottom: 100, left: 200}
    })
  }

  const updateBookingLocation = async () => {
      console.log("trying");
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
        console.log("now running")
        console.log(data);
      })
      .catch((err) => {
        console.log("Error updating booking location: ", err)
      })
  }

  useEffect(() => {
    if(booking.status === "confirmed"){
      fitMarkers();
    }
  }, [booking])

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
    if(!booking || booking?.status !== "ongoing") return;

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

    getTripTime();

  }, [booking, api])

  useEffect(() => {
    if(!locationUpdateRan){
      updateBookingLocation();
      dispatch(setLocationUpdatedRan(true))
    }
  }, [locationUpdateRan])

  return (
    <View className={`w-full h-full`}>
      <View className={`w-full h-full flex`}>
        <ScrollView contentContainerStyle={{
          display: "flex",
          flexDirection: "column"
        }}>
          <View style={{
            height: 0.7 * height
          }} className={`w-full relative`}>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.navigate("Home")
                }}>
                <Ionicons name="chevron-down" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrentLocation()}>
                    <MaterialIcons name="my-location" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[18%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => fitMarkers()}>
                    <MaterialCommunityIcons name="arrow-expand" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>
            <RequestMap mapRef={mapRef} theme={props.theme}/>
          </View>
          <View style={{
            height: 0.8 * height
          }} className={`w-full flex items-center justify-start gap-y-4 border-t-4 ${props.theme === "dark" ? "bg-[#0e1115] border-white" : "bg-gray-100 border-gray-200"}`}>
            <View className={`w-[95%] h-[20%] rounded-[20px] flex flex-row items-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
              <View className={`w-2/3 h-full flex-row`}>
                <View className={`w-1/3 h-full flex items-center justify-start pt-7`}>
                  <View className={`w-14 h-14 ${props.theme === "dark" ? "" : "bg-white"} rounded-full shadow-md`}></View>
                </View>
                <View className={`w-2/3 h-full flex items-start justify-center`}>
                  <Text style={{fontSize: getFontSize(20)}} className={`font-extrabold ${props.theme === "dark" ? "text-white" : "text-black "} tracking-tight`}>{driver?.firstname} {driver?.lastname}</Text>
                  <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Red Toyota Prius</Text>
                  <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>BAE 3155</Text>
                  <View className={`w-[95%] h-[20%] mt-2 rounded-[20px] bg-[#186f65] flex items-center justify-center overflow-hidden`}>
                    {min 
                    ?
                      <Text style={{fontSize: getFontSize(14)}} className={`text-white font-bold tracking-tight`}>{booking?.status === "ongoing" ? "You're on the way" : booking?.driverArrivedAtPickup ? "Driver has Arrived" : min > 2  ? `Arriving in ${min} mins` : "Arriving Soon"}</Text>
                    :
                      <PageLoader />
                    }
                  </View>
                </View>
              </View>
              <View className={`w-0 h-[80%] border-l-[0.5px] flex ${props.theme === "dark" ? "border-white" : "border-gray-300"}` }></View>
              <View className={`w-1/3 h-full flex items-center justify-center`}>
                <TouchableOpacity className={`w-[85%] h-[85%] flex items-center justify-center rounded-[20px] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"}`} onPress={() => {
                  booking?.status === "ongoing" 
                  ? 
                    console.log("You're on the way")
                  :
                  navigation.navigate("chat");
                }}>
                  {
                    booking?.status === "ongoing" 
                    ?
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <MaterialIcons name="star-rate" size={getFontSize(35)} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontSize: getFontSize(14)}} className={`font-semibold tracking-tight mt-1 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Rate Ride</Text>
                    </View>
                    :
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <Ionicons name="chatbubbles" size={getFontSize(35)} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontSize: getFontSize(14)}} className={`font-semibold tracking-tight mt-1 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Contact Driver</Text>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View className={`w-[95%] h-[40%] rounded-[20px] flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
              <View className={`w-[90%] flex items-center justify-between h-[90%]`}>
                <View className={`w-full h-1/3 flex-row items-center rounded-[16px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                  <View className={`w-[20%] h-full flex items-center justify-center`}>
                    <MaterialIcons name="trip-origin" size={getFontSize(35)} color={props.theme === "dark" ? "white" : "black"}/>
                  </View>
                  <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                  <View className={`w-[80%] h-full flex pr-5`}>
                    <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                      <Text style={{fontSize: getFontSize(25)}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Origin</Text>
                    </View>
                    <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                      <Text style={{fontSize: getFontSize(22)}} className={`tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{origin?.description.split(",")[0]}</Text>
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
                              <MaterialIcons name="keyboard-arrow-right" size={getFontSize(25)} color={props.theme === "dark" ? "white" : "black"}/>
                              <Text style={{fontSize: getFontSize(18)}} className={`tracking-tight font-extrabold ${props.theme === "dark" ? "text-white" : "text-black"}`}>Stop</Text>
                              <MaterialIcons name="keyboard-arrow-right" size={getFontSize(25)} color={props.theme === "dark" ? "white" : "black"}/>
                            </View>
                            <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                            <Text style={{fontSize: getFontSize(16)}} className={`tracking-tight text-center w-[80%] mt-1 h-1/2 truncate ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                          </View>
                          <View className={`w-[40%] h-full flex items-end justify-center pr-5`}>
                            <TouchableOpacity disabled={true} className={`p-2 opacity-50 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`} onPress={() => {
                              dispatch(setPassThrough(null))
                            }}>
                              <Text style={{fontSize: getFontSize(14)}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Remove</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        :
                        <View className={`w-full h-1/2 flex items-center justify-center`}>
                          <TouchableOpacity disabled={true} className={`p-2 rounded-full opacity-50 border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`} onPress={() => {
                            navigation.navigate("addStop")
                          }}>
                            <Text style={{fontSize: getFontSize(15)}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
                          </TouchableOpacity>
                        </View>
                      }
                      <View className={`w-full h-1/2 flex-row items-center rounded-[16px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                        <View className={`w-[20%] h-full flex items-center justify-center`}>
                          <FontAwesome name="flag-checkered" size={getFontSize(35)} color={props.theme === "dark" ? "white" : "black"}/>
                        </View>
                        <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                        {booking.status === "confirmed" 
                        ?
                          <View className={`w-[80%] h-full flex pr-5`}>
                            <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                              <Text style={{fontSize: getFontSize(25)}} className={`font-extrabold tracking-tight mr-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                            </View>
                            <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                              <Text style={{fontSize: getFontSize(22)}} className={`tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
                            </View>
                          </View>
                        :
                          <TouchableOpacity className={`w-[80%] h-full flex pr-5`}>
                            <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                              <Text style={{fontSize: getFontSize(25)}} className={`font-extrabold tracking-tight mr-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                              <Ionicons name="chevron-forward" size={getFontSize(25)} color={props.theme === "dark" ? "white" : "black"} />
                            </View>
                            <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                              <Text style={{fontSize: getFontSize(22)}} className={`tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
                            </View>
                          </TouchableOpacity>
                        }
                      </View>
                    </View>
                    :
                    <View className={`w-full h-2/3 flex bg-yellow-800`}></View>
                  }
              </View>
            </View>
            <View className={`w-[95%] h-[30%] flex flex-row items-center justify-evenly`}>
              <View className={`flex flex-col items-center`}>
                <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                  navigation.navigate("changePayment")
                }}>
                  <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
                    {paymentMethod === "cash" 
                    ?
                    <Ionicons name="cash" size={30} color="green"/>
                    :
                    <Entypo name="wallet" size={30} color="black" />
                    }
                  </View>
                </TouchableOpacity>
                <View className={`w-fit text-center flex flex-col items-center relative`}>
                  <Text style={{fontSize: getFontSize(14)}} className={`tracking-tight mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Payment</Text>
                  <Text style={{fontSize: getFontSize(10)}} className={`text-neutral-700 absolute -translate-y-1`}>{paymentMethod === "cash" ? "Cash" : "Mobile Money"}</Text>
                </View>
              </View>
              <View className={`flex flex-col items-center`}>
                <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`}>
                  <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
                    <Ionicons name="share" size={30} color={props.theme === "dark" ? "white" : "black"}/>
                  </View>
                </TouchableOpacity>
                <View className={`w-fit text-center flex flex-col items-center justify-start`}>
                  <Text style={{fontSize: getFontSize(14)}} className={`tracking-tight mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Share trip</Text>
                </View>
              </View>
              {
                booking?.status === "ongoing"
                ?
                <View className={`flex flex-col items-center`}>
                  <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`}>
                    <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
                      <MaterialIcons name="report" size={35} color={props.theme === "dark" ? "white" : "black"}/>
                    </View>
                  </TouchableOpacity>
                  <View className={`w-fit text-center flex flex-col items-center justify-start`}>
                    <Text style={{fontSize: getFontSize(14)}} className={` mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Report Driver</Text>
                  </View>
                </View>
                :
                <View className={`flex flex-col items-center`}>
                  <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                    navigation.navigate("cancel");
                  }}>
                    <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center bg-red-100`}>
                      <Entypo name="cross" size={30} color={"rgb(239,68,68)"}/>
                    </View>
                  </TouchableOpacity>
                  <View className={`w-fit text-center flex flex-col items-center justify-start`}>
                    <Text style={{fontSize: getFontSize(14)}} className={` mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Cancel Ride</Text>
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
