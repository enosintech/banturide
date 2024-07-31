import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, selectPrice, selectToggle, selectTravelTimeInformation, selectTripDetails, setTripDetails, setTravelTimeInformation, setOrigin, setDestination, setPrice, setBooking, setDriver, setPassThrough, selectSeats, selectTripType, selectPassThrough, selectBooking, selectWsClientId, selectDriverArray } from '../../../slices/navSlice';
import LottieView from "lottie-react-native";
import messaging from "@react-native-firebase/messaging";

import RequestMap from "../../components/atoms/RequestMap";
import PageLoader from '../../components/atoms/PageLoader';
import LoadingBlur from '../../components/atoms/LoadingBlur';

import { ensureNoQuotes } from '../../../utils/removeQuotes';
import { selectToken } from '../../../slices/authSlice';
import { useFetchFcmToken } from '../../hooks/useFetchFcmToken';

const RequestScreen = (props) => {
  
  const navigation = useNavigation();
  const mapRef = useRef();

  const [ loading, setLoading ] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  // const [ driverArray, setDriverArray ] = useState([1, 2, 3, 4, 5, 6, 7])
  const rating = 4.1;

  const dispatch = useDispatch();
  const fcmToken = useFetchFcmToken();

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
  const driverArray = useSelector(state => state.nav.driverArray);

  const tokens = useSelector(selectToken);
  const wsClientId = useSelector(selectWsClientId);

  const currentLocation = {
    latitude: origin?.location.lat,
    longitude: origin?.location.lng,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010
  }

  const goToCurrentLocation = () => {
    mapRef.current.animateToRegion(currentLocation, 1 * 1000)
  }

  useEffect(() => {
    handleDriverSearch(booking.bookingId);
  }, [])

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //       console.log("a new FCM message has arrived!", JSON.stringify(remoteMessage));
  //   });

  //   unsubscribe();
  // }, []);

  const handleDriverSearch = async (bookingId) => {
    try{
      await fetch("http://localhost:8080/Booking/search-driver", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.idToken}`,
          'x-refresh-token' : tokens?.refreshToken,
        },
        body: JSON.stringify({
          bookingId: bookingId,
          fcmToken: fcmToken?.token,
          wsClientId: wsClientId,
        })
      }).then((response) => response.json())
      .then((data) => {
        console.log(data);
      })

    } catch (error) {
      console.error("Failed to search for drivers: ", error)
    }  
  }

  const handleChooseDriver = async (bookingId, driverId) => {
    setLoading(true)
    try {
      await fetch("http://localhost:8080/Booking/select-driver", {
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
        setLoading(false)
        console.log(data)
      })
    } catch (error) {
      console.error("Failed to assign driver: ", error)
    }
  }

  const handleRemoveDriver = async () => {

  }

  const handleCancelBooking = async () => {
    setLoading(true)
    await fetch("https://banturide.onrender.com/bookride/cancel-booking", options)
    .then(response => response.json())
    .then(data => {
      if(data.success === false){
        setLoading(false)
        console.log(data.message)
      } else {
        setLoading(false)
        setModalVisible(false)
        // dispatch(setDestination(null))
        // dispatch(setOrigin(null))
        // dispatch(setPrice(null))
        // dispatch(setTravelTimeInformation(null))
        // dispatch(setTripDetails(null))
        // dispatch(setPassThrough(null))
        // dispatch(setBooking(null))
        navigation.navigate("Home")
      }
    })
  } 

  return (
    <View className={`flex-1 ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-gray-100"}`}>
      <Modal visible={modalVisible} onRequestClose={() => {setModalVisible(false)}} animationType="fade" >
        <View className={`w-full h-full flex flex-col items-center justify-end py-10 relative bg-white`}>
          <LoadingBlur loading={loading} />
          <View className={`w-[95%] h-[40%] px-5 flex flex-col items-center justify-center`}>
            <View className={`w-[80%] h-[50%]  bg-red-500`}></View>
            <Text className={`text-black font-extrabold text-2xl mt-5 text-center`}>Are you sure you would like to cancel this request?</Text>
            <Text className={`text-black mt-3 text-lg font-thin`}>If you wait you could be on your way soon!</Text>
          </View>
          <View className={`w-[95%] h-[15%] bg-white shadow border ${props.theme === "dark" ? "" : "border-gray-100"} mt-10 rounded-[20px] flex flex-row items-center justify-evenly`}>
            <TouchableOpacity onPress={handleCancelBooking} className={`w-[45%] h-[60%] flex items-center justify-center bg-red-700 rounded-[20px]`}>
              <Text className={`text-white font-bold text-lg`}>Cancel Request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(false)}} className={`w-[45%] h-[60%] flex items-center justify-center bg-green-700 rounded-[20px]`}>
              <Text className={`text-white font-bold text-lg`}>Keep Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className={`relative h-[65%] w-full flex items-center justify-center`}>
        <TouchableOpacity className={`absolute z-50 bottom-[5%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.navigate("Home")
                }}>
                <Ionicons name="chevron-down" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
        </TouchableOpacity>
        <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrentLocation()}>
                <MaterialIcons name="my-location" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
        <RequestMap mapRef={mapRef} theme={props.theme} />
        <View className={`absolute w-[300px] h-[300px] flex items-center justify-center`}>
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
        </View>
        <View className={`absolute top-20 w-[95%] h-[70%]`}>
          <ScrollView contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: 5,
            paddingVertical: 10,
          }}>
            {driverArray?.map((driver, index) => (
              <View key={driver?.driverId} className={`w-[95%] h-[150px] ${props.theme === "dark" ? "" : "bg-gray-100 border-gray-100"} rounded-[20px] shadow-md border-[0.5px] flex`}>
                <View className={`w-full h-1/2 flex flex-row items-center`}>
                  <View className={`w-[60%] h-full flex flex-row`}>
                    <View className={`w-[40%] h-full flex items-center justify-center`}>
                      <View className={`w-14 h-14 rounded-full ${props.theme === "dark" ? "" : "bg-white"}`}></View>
                    </View>
                    <View className={`w-[60%] h-full flex justify-center`}>
                      <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>{`${driver?.firstname} ${driver.lastname}`}</Text>
                      <Text style={{fontFamily: "os-mid"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Red Toyota Prius</Text>
                      <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>BAE 3155</Text>
                    </View>
                  </View>
                  <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "" : "border-gray-300"}`}></View>
                  <View className={`w-[40%] h-full flex items-center justify-center`}>
                    <View className={`w-[85%] h-[85%] rounded-[20px] flex items-center justify-center ${rating > 4 ? "bg-green-200" : rating > 2 ? "bg-gray-300" : "bg-red-200"}`}>
                      <Text style={{fontFamily: "os-light"}}>Rating</Text>
                      <Text style={{fontFamily: "os-xb"}} className={`text-3xl`}>{rating}</Text>
                    </View>
                  </View>
                </View>
                <View className={`w-full h-1/2 flex-row items-center justify-center`}>
                  <View className={`w-[95%] h-[80%] shadow border-[0.5px] rounded-[20px] flex flex-row items-center justify-between pl-1 pr-3 ${props.theme === "dark" ? "" : "bg-white border-gray-100"}`}>
                    <View className={`w-[50%] h-[85%] rounded-[20px] shadow-md border ${props.theme === "dark" ? "" : "bg-white border-gray-100"} flex px-2 py-1`}>
                      <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Known For</Text>
                      <Text className={`overflow-hidden w-full h-1/2`}>Clean Car, Punctual, Respectful</Text>
                    </View>
                    <View className={`flex flex-row`}>
                      <TouchableOpacity className="rounded-full bg-red-600 flex items-center justify-center w-12 h-12 mr-3" onPress={() => {
                        // dispatch(setDriverArray(driverArray.filter((driver) => {
                        //   return driver !==
                        // })))
                        // // setDriverArray(driverArray.filter((item) => {
                        // //   return item !== num
                        // // }))
                      }}>
                        <Entypo name="cross" size={25} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity className={`bg-[#186f65] flex items-center justify-center w-12 h-12 rounded-full`} onPress={handleChooseDriver}>
                        <Ionicons name="checkmark-sharp" size={25} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View className={`h-[35%] w-full flex border-t-4 border-solid ${props.theme === "dark" ? " bg-[#0e1115] border-white" : "border-gray-300"}`}>
        <View className={`w-full h-[60%] flex items-center justify-center`}>
          <View className={`w-[95%] h-[90%] rounded-[20px] border-[0.5px] flex flex-row shadow-md ${props.theem === "dark" ? "" : "bg-white border-gray-100"}`}>
            <View className={`w-1/2 h-full flex items-center`}>
              <View className={`w-full h-1/2 overflow-visible relative flex items-center justify-center`}>
                <Image 
                  source={tripDetails?.image}
                  style={{
                    width: 40,
                    height : 40,
                    overflow: "visible",
                  }}
                />
                <Text style={{fontFamily: "os-xb"}} className={`text-[16px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{tripDetails?.title}</Text>
                <Text style={{fontFamily: "os-light"}} className={`text-[12px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{seats} Seater</Text>
              </View>
              <View className={`w-[80%] h-0 border-t ${props.theme === "dark" ? "" : "border-gray-200"}`}></View>
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
                        <View className={`w-full h-full flex items-center justify-center`}>
                          <View className={`w-full h-1/2 flex flex-row items-center justify-center`}>
                            <MaterialIcons name="keyboard-arrow-right" size={20} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Stop</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={20} color={props.theme === "dark" ? "white" : "black"}/>
                          </View>
                          <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                          <Text style={{fontFamily: "os-light"}} className={`text-[12px] w-[80%] text-center mt-1 h-1/2 truncate ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                        </View>
                      </View>
                      :
                      <View className={`w-full h-1/2 flex items-center justify-center`}>
                        <View className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`}>
                          <Text style={{fontFamily: "os-mid"}} className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Stop</Text>
                        </View>
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
        <View className={`w-full h-[40%] flex items-center justify-start`}>
          <View className={`w-[95%] h-[80%] rounded-t-[20px] rounded-b-[30px] mt-1 shadow-md border-[0.5px] flex items-center justify-center ${props.theme === "dark" ? "" : "bg-white border-gray-100"}`}>
            <TouchableOpacity className={`w-[90%] h-[65%] bg-red-600 rounded-2xl flex items-center justify-center shadow-xl`} onPress={() => {
              navigation.navigate("Home")
            }}>
                <Text style={{fontFamily: "os-xb"}} className={`text-white text-lg`}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RequestScreen;