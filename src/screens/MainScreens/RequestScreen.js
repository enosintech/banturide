import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as SecureStore from "expo-secure-store";

import { selectDestination, selectOrigin, selectPrice, selectToggle, selectTravelTimeInformation, selectTripDetails, setTripDetails, setTravelTimeInformation, setOrigin, setDestination, setPrice, setBooking, setDriver, setPassThrough, selectSeats, selectTripType, selectPassThrough, selectBooking, selectWsClientId, selectDriverArray, selectIsSearching, setSearchPerformed, setBookingRequested, resetSearch, setSearchComplete, removeDriver, setDriverArray, selectFindNewDriver, setFindNewDriver, setNewDriverCalled, selectDeliveryType, setDeliveryType, setRecipient } from '../../../slices/navSlice';
import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from '../../../slices/authSlice';

import RequestMap from "../../components/atoms/RequestMap";
import PageLoader from '../../components/atoms/PageLoader';
import LoadingBlur from '../../components/atoms/LoadingBlur';


const { width } = Dimensions.get("window");

const RequestScreen = (props) => {
  
  const navigation = useNavigation();
  const mapRef = useRef();

  const [ loading, setLoading ] = useState(false)
  const [ searchError, setSearchError ] = useState(false);
  const [ cancelError, setCancelError ] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ searchCompleteText, setSearchCompleteText ] = useState("");
  const rating = 4.1;

  const dispatch = useDispatch();

  const bookingRequested = useSelector(state => state.nav.bookingRequested);
  const searchPerformed = useSelector(state => state.nav.searchPerformed);
  const searchComplete = useSelector(state => state.nav.searchComplete);
  const findNewDriver = useSelector(selectFindNewDriver);
  const newDriverCalled = useSelector(state => state.nav.newDriverCalled)
  const isSignedIn = useSelector(selectIsSignedIn);

  const fontSize = width * 0.05;

  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination);
  const price = useSelector(selectPrice);
  const tripDetails = useSelector(selectTripDetails);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const tripType = useSelector(selectTripType);
  const seats = useSelector(selectSeats);
  const toggle = useSelector(selectToggle);
  const booking = useSelector(selectBooking);
  const tokens = useSelector(selectToken);
  const driverArray = useSelector(state => state.nav.driverArray);

  const deliveryType = useSelector(selectDeliveryType);

  const currentLocation = {
    latitude: origin?.location.lat,
    longitude: origin?.location.lng,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010
  }

  const goToCurrentLocation = () => {
    mapRef.current.animateToRegion(currentLocation, 1 * 1000)
  }

  const handleDriverSearch = async (bookingId) => {
    dispatch(setSearchComplete(false))
    try{
      await fetch("https://banturide-api.onrender.com/booking/search-driver", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.idToken}`,
          'x-refresh-token' : tokens?.refreshToken,
        },
        body: JSON.stringify({
          bookingId: bookingId,
        })
      }).then((response) => response.json())
      .then((data) => {

        if(data.success === false) {
          throw new Error(data.message || data.error)
        } else {
          if(data.message === "Booking confirmed and Search has now stopped" || data.message === "Booking confirmed successfully!" || data.message === "Booking cancelled and Search has now stopped"){
            // do nothing as only the calling of another function can trigger this
          } else if (data.message === "No drivers found within the time limit."){
            setSearchCompleteText("No drivers found within the time limit")
            dispatch(setSearchComplete(true))
          } else if (data.message === "Drivers were found and the search is complete") {
            setSearchCompleteText("Drivers were found but none were chosen")
            dispatch(setSearchComplete(true))
          } else {
            setSearchCompleteText("Search ran for 2 minutes")
            dispatch(setSearchComplete(true))
          }
        }

      })

    } catch (error) {
      const errorField = error.message || error.error;

      if(errorField === "Unauthorized") {
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
          dispatch(setSearchComplete(true))
          setSearchCompleteText("Something went wrong")
          setSearchError("Error Searching for driver. Unauthorized")
          setTimeout(() => {
            setSearchError(false)
          }, 3000)
        })
      } else {
        dispatch(setSearchComplete(true))
        setSearchCompleteText(errorField || "Something went wrong")
        setSearchError(errorField || "Something went wrong")
        setTimeout(() => {
          setSearchError(false)
        }, 4000)
      }
    }  
  }

  const handleDeliverySearch = async (deliveryId) => {
    dispatch(setSearchComplete(false))
    try {
      await fetch("https://banturide-api.onrender.com/delivery/findDriver", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.idToken}`,
          'x-refresh-token' : tokens?.refreshToken,
        },
        body: JSON.stringify({
          deliveryId: deliveryId,
        })
      }).then((response) => response.json())
      .then((data) => {

        if(data.success === false) {
          throw new Error(data.message || data.error)
        } else {
          console.log(data)
          if(data.message === "No drivers found within the time limit.") {
            setSearchCompleteText("No drivers found within the time limit");
            dispatch(setSearchComplete(true))
          } else {
            dispatch(setFindNewDriver(false))
            dispatch(setNewDriverCalled(false))
            dispatch(setBooking(data.booking))
            dispatch(setDriver(data.driver))
            navigation.navigate("RequestNavigator")
          }
        }

      })
    } catch (error) {
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
          dispatch(setSearchComplete(true))
          setSearchCompleteText("Something went wrong")
          setSearchError("Error Searching for driver. Unauthorized")
          setTimeout(() => {
            setSearchError(false)
          }, 3000)
        })
      } else {
        dispatch(setSearchComplete(true))
        setSearchCompleteText(errorField || "Something went wrong")
        setSearchError(errorField || "Something went wrong")
        setTimeout(() => {
          setSearchError(false)
        }, 4000)
      }
    }
  }

  const handleDriverReSearch = () => {
    dispatch(resetSearch()); 
    dispatch(setBookingRequested(true));
  };

  const handleChooseDriver = async (bookingId, driverId) => {
    setLoading(true)
    try {
      await fetch("https://banturide-api.onrender.com/booking/select-driver", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.idToken}`,
          'x-refresh-token' : tokens?.refreshToken,
        },
        body: JSON.stringify({
          bookingId: bookingId,
          driverId: driverId,
        })
      })
      .then((response) => response.json())
      .then((data) => {

        if(data.success === false) {
          throw new Error(data.message || data.error)
        } else {
          setLoading(false)
          dispatch(setDriverArray([]))
          dispatch(setFindNewDriver(false))
          dispatch(setNewDriverCalled(false))
          dispatch(setBooking(data.booking))
          dispatch(setDriver(data.driver))
          navigation.navigate("RequestNavigator")
        }
    
      })
    } catch (error) {
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
          setLoading(false)
          setSearchError("Error Choosing driver. Unauthorized")
          setTimeout(() => {
            setSearchError(false)
          }, 3000)
        })
      } else {
        setLoading(false)
        setSearchError(errorField)
        setTimeout(() => {
          setSearchError(false)
        }, 3000)
      }
    }
  }

  const handleCancelBooking = async () => {
    setLoading(true)
    await fetch("https://banturide-api.onrender.com/booking/cancel-booking-request", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens?.idToken}`,
        'x-refresh-token' : tokens?.refreshToken,
      },
      body: JSON.stringify({
        bookingId: booking?.bookingId,
        reason: "",
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.success === false){
        throw new Error(data.message || data.error)
      } else {
        setLoading(false)
        setModalVisible(false)
        dispatch(setDestination(null))
        dispatch(setOrigin(null))
        dispatch(setPrice(null))
        dispatch(setTravelTimeInformation(null))
        dispatch(setTripDetails(null))
        dispatch(setPassThrough(null))
        dispatch(setBooking(null))
        dispatch(setDeliveryType(null))
        dispatch(setRecipient(null))
        dispatch(setDriverArray([]))
        dispatch(setBookingRequested(false))
        dispatch(setSearchPerformed(false))
        dispatch(setSearchComplete(false))
        navigation.navigate("Home")
      }
    })
    .catch( async (error) => {
      const errorField = error.message || error.error;

      if(errorField === "Unauthorized") {
        await SecureStore.deleteItemAsync("tokens")
        .then(() => {
          setLoading(false)
          setModalVisible(false)
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
          setLoading(false)
          setCancelError("Error cancelling booking. Unauthorized")
          setTimeout(() => {
            setCancelError(false)
          }, 3000)
        })
      } else {
        setLoading(false)
        setCancelError(errorField)
        setTimeout(() => {
          setCancelError(false)
        }, 3000)
      }
    })
  } 
 
  const handleCancelDelivery = async () => {
    setLoading(true)
    await fetch ("https://banturide-api.onrender.com/delivery/cancel-delivery", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens?.idToken}`,
        'x-refresh-token' : tokens?.refreshToken,
      },
      body: JSON.stringify({
        deliveryId: booking?.bookingId,
        reason: "",
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.success === false) {
        throw new Error(data.message || data.error)
      } else {
        setLoading(false)
        setModalVisible(false)
        dispatch(setDestination(null))
        dispatch(setOrigin(null))
        dispatch(setPrice(null))
        dispatch(setTravelTimeInformation(null))
        dispatch(setTripDetails(null))
        dispatch(setPassThrough(null))
        dispatch(setBooking(null))
        dispatch(setDeliveryType(null))
        dispatch(setRecipient(null))
        dispatch(setDriverArray([]))
        dispatch(setBookingRequested(false))
        dispatch(setSearchPerformed(false))
        dispatch(setSearchComplete(false))
        navigation.navigate("Home")
      }
    })
    .catch( async (error) => {
      const errorField = error.message || error.error;

      if(errorField === "Unauthorized") {
        await SecureStore.deleteItemAsync("tokens")
        .then(() => {
          setLoading(false)
          setModalVisible(false)
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
          setLoading(false)
          setCancelError("Error cancelling booking. Unauthorized")
          setTimeout(() => {
            setCancelError(false)
          }, 3000)
        })
      } else {
        setLoading(false)
        setCancelError(errorField)
        setTimeout(() => {
          setCancelError(false)
        }, 3000)
      }
    })
  }

  useEffect(() => {
    if(findNewDriver && !newDriverCalled && booking?.bookingType === "ride" ){
      handleDriverReSearch();
      dispatch(setNewDriverCalled(true))
    }
  }, [findNewDriver, newDriverCalled, booking ])

  useEffect(() => {
    if(findNewDriver && !newDriverCalled && booking?.bookingType === "delivery" ){
      handleDriverReSearch();
      dispatch(setNewDriverCalled(true))
    }
  }, [findNewDriver, newDriverCalled, booking ])

  useEffect(() => {
    if (bookingRequested && !searchPerformed && booking?.bookingType === "ride") {
      handleDriverSearch(booking?.bookingId);
      dispatch(setSearchPerformed(true));
    }
  }, [bookingRequested, searchPerformed, booking]);

  useEffect(() => {
    if(bookingRequested && !searchPerformed && booking?.bookingType === "delivery") {
      handleDeliverySearch(booking?.bookingId);
      dispatch(setSearchPerformed(true))
    }
  }, [bookingRequested, searchPerformed, booking])

  return (
    <View className={`flex-1 ${props.theme === "dark" ? "bg-dark-primary" : "bg-gray-100"} relative`}>
    
      <LoadingBlur loading={loading} theme={props.theme} />

      {searchComplete && 
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)"}} className={`absolute z-[10] w-full h-full flex flex-row items-end`}>

          { cancelError &&
              <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                  <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                      <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof cancelError === "string" ? cancelError : "Server or Network Error Occurred"}</Text>
                  </View>
              </View>
          }

          <View className={`w-full h-[25%] ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} rounded-t-[40px] flex flex-col`}>
            <View className={`w-full h-1/2 flex items-center justify-center`}>
              <Text style={{fontSize: fontSize}}  className={`font-bold tracking-tight text-center max-w-[60%] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{searchCompleteText ? searchCompleteText : "Search is Complete"}</Text>
            </View>
            <View className={`w-full h-[40%] flex flex-row items-center justify-evenly`}>
              <TouchableOpacity className={`w-[45%] h-[90%] rounded-[50px] shadow-sm bg-red-700 flex items-center justify-center`} onPress={booking?.bookingType === "ride" ? handleCancelBooking : handleCancelDelivery}>
                <Text style={{fontSize: fontSize * 0.9}} className={`font-bold tracking-tight text-white`}>Cancel Request</Text>
              </TouchableOpacity>

              <TouchableOpacity className={`w-[45%] h-[90%] rounded-[50px] shadow-sm bg-green-700 flex items-center justify-center`} onPress={() => handleDriverReSearch()}>
                <Text style={{fontSize: fontSize * 0.9}} className={`font-bold tracking-tight text-white`}>Search Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }

      {modalVisible && 
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)"}} className={`absolute z-[10] w-full h-full flex items-center justify-center`}>

          { cancelError &&
              <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                  <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                      <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof cancelError === "string" ? cancelError : "Server or Network Error Occurred"}</Text>
                  </View>
              </View>
          }

          <View className={`w-[90%] h-[20%] ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} shadow-sm rounded-[40px] p-2 flex flex-col`}>
            <View className="w-full h-1/2 flex items-center justify-center">
              <Text style={{fontSize: fontSize * 0.7}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} text-center max-w-[90%]`}>Are you sure you want to cancel your request? We will find you a suitable driver soon!</Text>
            </View>
            <View className="w-full h-1/2 flex flex-row items-center justify-evenly">
              <TouchableOpacity className={`w-[45%] h-[90%] rounded-[40px] bg-red-700 flex items-center justify-center`} onPress={booking?.bookingType === "ride" ? handleCancelBooking : handleCancelDelivery}>
                <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight text-white`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity className={`w-[45%] h-[90%] rounded-[40px] bg-green-700 flex items-center justify-center`} onPress={ () => setModalVisible(false)}>
                <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight text-white`}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
      
      <View className={`relative h-[65%] w-full flex items-center justify-center`}>
        <TouchableOpacity className={`absolute z-50 bottom-[5%] right-[5%] rounded-[15px] shadow-sm ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.navigate("Home");
                }}>
                <Ionicons name="chevron-down" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`} />
        </TouchableOpacity>
        <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[5%] rounded-[15px] shadow-sm ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrentLocation()}>
                <MaterialIcons name="my-location" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
        <RequestMap mapRef={mapRef} theme={props.theme} />

        {searchError &&
            <View className={`w-full h-[9%] absolute z-[2000] top-28 flex items-center justify-center`}>
                <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                    <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof searchError === "string" ? searchError : "Server or Network Error Occurred"}</Text>
                </View>
            </View>
        }

        <View className={`absolute w-[80%] h-[55%] flex items-center justify-center`}>
            {
              searchComplete ? 
              <View></View>
            : 
              <LottieView 
                source={require("../../../assets/animations/findDriver.json")}
                loop
                autoPlay
                speed={1}
                style={{
                    width: 600,
                    height: 600
                }}
              />
            }
        </View>
        <View className={`absolute top-20 w-[95%] h-full overflow-visible`}>
          <ScrollView contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: 5,
            paddingVertical: 10,
            overflow: "visible"
          }}>
            {driverArray?.map((driver, index) => (
              <View key={driver?.driverId} className={`w-[95%] h-[220px] ${props.theme === "dark" ? "bg-dark-primary" : "bg-gray-100 border-[0.5px] border-gray-100"} rounded-[40px] shadow-sm flex`}>
                <View className={`w-full h-1/3 flex flex-row items-center`}>
                  <View className={`w-[60%] h-full flex flex-row`}>
                    <View className={`w-[40%] h-full flex items-center justify-center`}>
                      <View className={`w-14 h-14 rounded-full overflow-hidden ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"}`}>
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
                    <View className={`w-[60%] h-full flex justify-center`}>
                      <Text numberOfLines={1} style={{fontSize: fontSize * 0.7}} className={`font-extrabold max-w-[90%] tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{`${driver?.firstname} ${driver?.lastname}`}</Text>
                      <Text numberOfLines={1} style={{fontSize: fontSize * 0.7}} className={`font-medium max-w-[90%] tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{driver?.carColor} {driver?.carManufacturer} {driver?.carModel}</Text>
                      <Text numberOfLines={1}  style={{fontSize: fontSize * 0.7}} className={`font-light max-w-[90%] tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{driver?.vehicleReg}</Text>
                    </View>
                  </View>
                  <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-white" : "border-gray-300"}`}></View>
                  <View className={`w-[40%] h-full flex items-center justify-center`}>
                    <View className={`w-[85%] h-[85%] rounded-[40px] flex items-center justify-center ${driver?.driverRating > 4 ? "bg-green-200" : driver?.driverRating > 2 ? "bg-gray-300" : "bg-red-200"}`}>
                      <Text style={{fontSize: fontSize * 0.6}} className={`font-light tracking-tight`}>Rating</Text>
                      <Text style={{fontSize: fontSize * 1.5}} className={`font-black tracking-tight`}>{driver?.driverRating}</Text>
                    </View>
                  </View>
                </View>
                <View className={`w-full h-1/3 flex-row items-center justify-center`}>
                  <View className={`w-[95%] h-[80%] shadow-sm rounded-[40px] flex flex-row items-center justify-between pl-1 pr-3 ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border-[0.5px] border-gray-100"}`}>
                    <View className={`w-[50%] h-[85%] rounded-[40px] shadow-sm ${props.theme === "dark" ? "bg-dark-tertiary" : "bg-white border border-gray-100"} flex justify-center px-2 pl-3 py-1`}>
                      <Text style={{fontSize: fontSize * 0.65}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Known For</Text>
                      <Text numberOfLines={1} style={{fontSize: fontSize * 0.55}} className={`font-medium ${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight w-full h-1/2`}>{driver?.knownFor.join(", ")}</Text>
                    </View>
                    <View className={`flex flex-row`}>
                      <TouchableOpacity className="rounded-full bg-red-600 flex items-center justify-center w-12 h-12 mr-3" onPress={() => {
                        dispatch(removeDriver(driver.driverId))
                      }}>
                        <Entypo name="cross" size={fontSize * 1.4} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity className={`bg-[#186f65] flex items-center justify-center w-12 h-12 rounded-full`} onPress={() => handleChooseDriver(booking?.bookingId, driver?.driverId)}>
                        <Ionicons name="checkmark-sharp" size={fontSize * 1.4} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className={`w-full h-1/3 flex flex-row items-center justify-between px-4 pb-2`}>
                  <View className={`w-full h-[85%] rounded-[40px] flex items-center justify-center ${driver?.timeRemaining < 10 ? "bg-red-200" : driver?.timeRemaining < 5 ? "bg-red-700" : "bg-neutral-200"} shadow-sm`}>
                    <Text style={{fontSize: fontSize * 1.5}} className={`font-black tracking-tight`}> Expires in {driver?.timeRemaining}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View className={`h-[35%] relative z-100 w-full flex border-t-4 border-solid ${props.theme === "dark" ? " bg-dark-primary border-white" : "bg-gray-100 border-gray-300"}`}>
        <View className={`w-full h-[60%] flex items-center justify-center`}>
          <View className={`w-[95%] h-[90%] rounded-[40px] flex flex-row shadow-sm ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border-[0.5px] border-gray-100"}`}>
            <View className={`w-1/2 h-full flex items-center`}>
              <View className={`w-full h-1/2 overflow-visible relative flex items-center justify-center`}>
                <Image 
                  source={booking?.bookingType === "ride" ? tripDetails?.image : deliveryType?.image}
                  style={{
                    width: 40,
                    height : 40,
                    overflow: "visible",
                  }}
                />
                <Text style={{fontSize: fontSize * 0.7}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{ booking?.bookingType === "ride" ? tripDetails?.title : deliveryType?.title}</Text>
                <Text style={{fontSize: fontSize * 0.55}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{booking?.bookingType === "ride" ? seats + " " + "seater" :  deliveryType?.description }</Text>
              </View>
              <View className={`w-[80%] h-0 border-t ${props.theme === "dark" ? "border-white" : "border-gray-200"}`}></View>
              <View className={`w-full h-1/2 flex items-center`}>
              <View className={`w-full h-2/3 flex items-center justify-center`}>
                {price
                ?
                  <Text style={{fontSize: fontSize * 1.6}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-gray-700"}`}>{price}</Text>                              
                :
                  <PageLoader theme={props.theme} width="60%" height="70%"/>
                }
              </View>
              <View className={`w-[75%] h-1/3 flex-row items-center justify-evenly`}>
                {tripType === "normal"
                  ?
                    travelTimeInformation  
                    ?
                        <Text style={{fontSize: fontSize * 0.65}} className={`text-[14px] font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text)} KM</Text>
                    :
                        <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                  :
                    <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Chaffeur</Text>
                }
                {tripType === "normal"
                  ?
                    travelTimeInformation  
                    ?
                        <Text style={{fontSize: fontSize * 0.65}} className={`text-[14px] font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? parseInt(travelTimeInformation[0].duration.text) + parseInt(travelTimeInformation[1].duration.text) : parseInt(travelTimeInformation[0].duration.text)} Mins</Text>
                    :
                        <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                  :
                    <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Mode</Text>
                }
              </View>
            </View>
            </View>
            <View className={`w-1/2 h-full flex items-center justify-center`}>
            <View className={`w-[90%] flex justify-between h-[90%]`}>
              <View className={`w-full h-1/3 flex-row items-center rounded-[40px] pr-2 ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                <View className={`w-[30%] h-full flex items-center justify-center`}>
                  <MaterialIcons name="trip-origin" size={fontSize * 1.3} color={props.theme === "dark" ? "white" : "black"}/>
                </View>
                <View className={`w-0 h-[80%] border-l-[0.5px] ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                <View className={`w-[70%] h-full flex`}>
                  <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                    <Text style={{fontSize: fontSize * 0.65}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Origin</Text>
                  </View>
                  <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                    <Text numberOfLines={1} style={{fontSize: fontSize * 0.55}} className={`font-light tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{origin?.description.split(",")[0]}</Text>
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
                            <MaterialIcons name="keyboard-arrow-right" size={fontSize} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: fontSize * 0.6}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>Stop</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={fontSize} color={props.theme === "dark" ? "white" : "black"}/>
                          </View>
                          <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                          <Text numberOfLines={1} style={{fontSize: fontSize * 0.55 }} className={`font-light tracking-tight w-[80%] text-center mt-1 h-1/2 truncate ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                        </View>
                      </View>
                      :
                      <View className={`w-full h-1/2 flex items-center justify-center`}>
                        <View className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white shadow-sm border-gray-100"}`}>
                          <Text style={{fontSize: fontSize * 0.45}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Stop</Text>
                        </View>
                      </View>
                    }
                    <View className={`w-full h-1/2 flex-row items-center rounded-[40px] pr-2 ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                      <View className={`w-[30%] h-full flex items-center justify-center`}>
                        <FontAwesome name="flag-checkered" size={fontSize * 1.1} color={props.theme === "dark" ? "white" : "black"}/>
                      </View>
                      <View className={`w-0 h-[80%] border-l-[0.5px] ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                      <View className={`w-[70%] h-full flex`}>
                        <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                          <Text style={{fontSize: fontSize * 0.65}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                        </View>
                        <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                          <Text numberOfLines={1} style={{fontSize: fontSize * 0.55}} className={`font-light tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
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
        <View className={`w-full h-[40%] flex items-center justify-start`}>
          <View className={`w-[95%] h-[80%] rounded-[40px] mt-1 shadow-sm flex items-center justify-center ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white border-[0.5px] border-gray-100"}`}>
            <TouchableOpacity className={`w-[90%] h-[65%] bg-red-600 rounded-[50px] flex items-center justify-center shadow-xl`} onPress={() => {
              setModalVisible(true)
            }}>
                <Text style={{fontSize: fontSize * 0.85}} className={`text-white font-extrabold tracking-tight`}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RequestScreen;