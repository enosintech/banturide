import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions, Modal } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

import PageLoader from '../../components/atoms/PageLoader';

import { selectDestination, selectOrigin, selectPrice, selectToggle, selectTravelTimeInformation, selectTripDetails, selectBooking, selectSchoolPickup, selectTripType, selectPassThrough, setPassThrough, selectSeats, setBookingRequestLoading, selectWsClientId, selectPaymentMethod, setBookingRequested, selectDeliveryType, selectRecipient, setDeliveryType, setRecipient } from '../../../slices/navSlice';
import { setDestination, setOrigin, setPrice, setTravelTimeInformation, setTripDetails, setBooking } from '../../../slices/navSlice';
import { selectToken, selectUserInfo } from '../../../slices/authSlice';

const { width } = Dimensions.get("window");

const ConfirmScreen = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fontSize = width * 0.05;
  
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
  const tokens = useSelector(selectToken);
  const paymentMethod = useSelector(selectPaymentMethod);
  const deliveryType = useSelector(selectDeliveryType);
  const recipient = useSelector(selectRecipient);
  const [ cancelPromptVisible, setCancelPromptVisible ] = useState(false)

  const rideRequestForm = {
    user: userInfo ? userInfo._id : "",
    price: parseFloat(price?.replace(/[K]/g, "")),
    hasThirdStop: passThrough ? true : false,
    thirdStopLatitude: passThrough ? passThrough.location.lat : "",
    thirdStopLongitude: passThrough ? passThrough.location.lng : "",
    pickUpLatitude: origin.location.lat,
    pickUpLongitude: origin.location.lng,
    dropOffLatitude: destination.location.lat,
    dropOffLongitude: destination.location.lng,
    seats: seats,
    paymentMethod: paymentMethod
  }

  const handleMakeRideRequest = async () => {
    dispatch(setBookingRequestLoading(true));
    await fetch("https://banturide-api.onrender.com/booking/make-book-request", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens?.idToken}`,
        'x-refresh-token' : tokens?.refreshToken,
      },
      body: JSON.stringify(rideRequestForm)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.success === false){
        dispatch(setBookingRequestLoading(false))
        console.log(data.error, "failed")
      } else {
        dispatch(setBookingRequestLoading(false))
        dispatch(setBooking(data.booking))
        dispatch(setBookingRequested(true))
        navigation.navigate("Home")
        navigation.navigate("requests")
      }
    })
    .catch((error) => {
      console.log("Error making a booking:", error);
    })
  }

  const handleMakeDeliveryRequest = async () => {
    console.log("delivery made")
  }

  return (
    <SafeAreaView className={`relative h-full w-full flex items-center ${props.theme === "dark" ? "bg-dark-primary" : ""}`}>

        <Modal transparent={true} animationType="slide" visible={cancelPromptVisible} onRequestClose={() => {
          if(cancelPromptVisible === true){
              return
          } else {
              setCancelPromptVisible(false)
          }
        }}>
          <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex flex-row items-end`}>
              <View className={`w-full h-[30%] ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} rounded-t-[30px] flex items-center`}>
                <View className={`w-full h-1/2 flex items-center justify-center`}>
                  <Text style={{fontSize: fontSize}} className={`font-extrabold tracking-tight text-center max-w-[60%] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Are you sure you want to Cancel?</Text>
                </View>
                <View className={`w-[90%] h-0 border ${props.theme === "dark" ? "border-white" : "border-gray-200"}`}></View>
                <View className={`w-full h-1/2 flex flex-row items-start pt-3 justify-evenly`}>
                  <TouchableOpacity className={`w-[45%] h-[70%] rounded-[50px] bg-[#186f65] flex items-center justify-center`} onPress={() => {
                    setCancelPromptVisible(false)
                  }}>
                      <Text style={{fontSize: fontSize }} className={`text-white font-extrabold tracking-tight`}>Go Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className={`w-[45%] h-[70%] rounded-[50px] bg-red-600 flex items-center justify-center`} onPress={() => {
                    setCancelPromptVisible(false)
                    dispatch(setDestination(null))
                    dispatch(setOrigin(null))
                    dispatch(setPassThrough(null))
                    dispatch(setPrice(null))
                    dispatch(setTravelTimeInformation(null))
                    dispatch(setTripDetails(null))
                    dispatch(setDeliveryType(null))
                    dispatch(setRecipient(null))
                    navigation.navigate("Home")
                  }}>
                      <Text style={{fontSize: fontSize }} className={`font-extrabold tracking-tight text-white`}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </Modal>

      <View className={`relative w-full h-[12%] flex-row items-center border-b-[0.25px] justify-center`}>
        <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{toggle === "ride" ? "Trip Summary" : "Delivery Summary"} - </Text>
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
        <TouchableOpacity className={`absolute left-2`} onPress={() => {
          navigation.goBack();
        }}>
          <Ionicons name='chevron-back' size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
      </View>
      <View className={`w-full h-[55%] flex justify-center items-center`}>
        <View className={`flex-row w-[90%] h-[90%] shadow-sm rounded-[35px] ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"}`}>
          {toggle === "ride" 
          ?
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
                <Text style={{fontSize: fontSize * 0.7}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{tripDetails?.title}</Text>
                <Text style={{fontSize: fontSize * 0.55}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{seats} Seater</Text>
              </View>
              <View className={`w-[80%] h-0 border-b ${props.theme === "dark" ? "border-white" : "border-gray-200"}`}></View>
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
                          <Text style={{fontSize: fontSize * 0.6}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? (parseFloat(travelTimeInformation[0].distance.text) + parseFloat(travelTimeInformation[1].distance.text)).toFixed(1) : parseFloat(travelTimeInformation[0].distance.text)} KM</Text>
                      :
                          <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                    :
                      <Text style={{fontSize: fontSize}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Chaffeur</Text>
                  }
                  {tripType === "normal"
                    ?
                      travelTimeInformation  
                      ?
                          <Text style={{fontSize: fontSize * 0.6}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{travelTimeInformation.length > 1 ? parseInt(travelTimeInformation[0].duration.text) + parseInt(travelTimeInformation[1].duration.text) : parseInt(travelTimeInformation[0].duration.text)} Mins</Text>
                      :
                          <PageLoader theme={props.theme} width={"25%"} height={"50%"}/>
                    :
                      <Text style={{fontSize: fontSize}} className={`font-semibold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Mode</Text>
                  }
                </View>
              </View>
            </View>
          :
            <View className={`w-1/2 h-full flex items-center py-1`}>
                  <View className={`w-full h-1/2 flex items-center justify-center`}>
                    <View className={`w-[90%] h-[90%] ${props.theme === "dark" ? "bg-dark-tertiary" : "bg-white"} shadow-sm rounded-[30px] flex flex-row items-center`}>
                      <Image 
                        source={deliveryType?.image}
                        style={{
                          width: 75,
                          height: 75,
                          resizeMode: "contain"
                        }}
                      />
                      <View className={`-translate-x-7`}>
                        <Text style={{fontSize: fontSize * 0.7}} className={`font-black tracking-tight relative z-20 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{deliveryType?.title}</Text>
                        <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} text-right`}>{deliveryType.description}</Text>
                      </View>
                    </View>
                  </View>
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
                  <Text style={{fontSize: fontSize * 0.7}} numberOfLines={1} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Recipient</Text>
                  <Text style={{fontSize: fontSize * 0.6}} numberOfLines={1} className={`font-medium tracking-tight max-w-[35%] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{recipient?.recipientFullName.split(" ")[0]}</Text>
                </View>
              </View>
            </View>
          }
          <View className={`w-1/2 h-full flex items-center justify-center`}>
            <View className={`w-[90%] flex justify-between h-[90%]`}>
              <View className={`w-full h-1/3 flex-row items-center rounded-[25px] pr-4 ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                <View className={`w-[30%] h-full flex items-center justify-center`}>
                  <MaterialIcons name="trip-origin" size={fontSize * 1.2} color={props.theme === "dark" ? "white" : "black"}/>
                </View>
                <View className={`w-0 h-[80%] border-l-[0.5px] ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                <View className={`w-[70%] h-full flex`}>
                  <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                    <Text style={{fontSize: fontSize * 0.7}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Origin</Text>
                  </View>
                  <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                    <Text style={{fontSize: fontSize * 0.5}} className={`font-light text-right tracking-tight ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{origin?.description.split(",")[0]}</Text>
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
                            <MaterialIcons name="keyboard-arrow-right" size={fontSize} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: fontSize * 0.55}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Stop</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={fontSize} color={props.theme === "dark" ? "white" : "black"}/>
                          </View>
                          <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                          <Text style={{fontSize: fontSize * 0.45}} className={`font-light tracking-tight w-[80%] mt-1 h-1/2 truncate text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                        </View>
                        <View className={`w-[40%] h-full flex items-center justify-center`}>
                          <TouchableOpacity className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white shadow-sm border-gray-100"}`} onPress={() => {
                            dispatch(setPassThrough(null))
                          }}>
                            <Text style={{fontSize: fontSize * 0.5}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      :
                      <View className={`w-full h-1/2 flex items-center justify-center`}>
                        <TouchableOpacity className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white shadow-sm border-gray-100"}`} onPress={() => {
                          navigation.navigate("addStop")
                        }}>
                          <Text style={{fontSize: fontSize * 0.5}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
                        </TouchableOpacity>
                      </View>
                    }
                    <View className={`w-full h-1/2 flex-row items-center rounded-[25px] pr-4 ${props.theme === "dark" ? "bg-dark-tertiary border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                      <View className={`w-[30%] h-full flex items-center justify-center`}>
                        <FontAwesome name="flag-checkered" size={fontSize * 1.2} color={props.theme === "dark" ? "white" : "black"}/>
                      </View>
                      <View className={`w-0 h-[80%] border-l-[0.5px] ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                      <View className={`w-[70%] h-full flex`}>
                        <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                          <Text style={{fontSize: fontSize * 0.65}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                        </View>
                        <View className={`w-full h-1/2 flex flex-row items-center justify-end pr-2`}>
                          <Text style={{fontSize: fontSize * 0.5}} className={`font-light text-right tracking-tight ml-2 pb-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
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
      <View className={`w-[90%] ${props.theme === "dark" ? "bg-dark-secondary border-gray-700" : "bg-white"} rounded-[40px] shadow-sm h-[23%] flex`}>
        <View className={`w-full h-full flex-row items-center`}>
          <TouchableOpacity className={`w-[18%] h-full flex items-center justify-center translate-x-1`} onPress={() => {
            navigation.navigate("togglePayment");
          }}>
              {paymentMethod === "cash" ? 
                  <Ionicons name="cash" size={fontSize * 1.5} color="green" />
              :
                  <Entypo name="wallet" color={props.theme === "dark" ? "white" : "black"} size={fontSize * 1.5} />
              }
          </TouchableOpacity>
          <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-white" : "border-gray-300"}`}></View>
          <View className={`w-[41%] h-full flex items-center justify-center`}>
            <TouchableOpacity className={`h-[80%] w-[90%] rounded-[35px] bg-red-600 flex items-center justify-center`} onPress={() => {
              setCancelPromptVisible(true)
            }}>
              <Text style={{fontSize: fontSize * 0.7}} className={`font-extrabold tracking-tight text-white`}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
          <View className={`w-[41%] h-full flex items-center justify-center`}>
            <TouchableOpacity className={`h-[80%] w-[90%] rounded-[35px] bg-[#186f65] flex items-center justify-center`} onPress={ toggle === "ride" ? handleMakeRideRequest : handleMakeDeliveryRequest}>
              <Text style={{fontSize: fontSize * 0.7}} className={`text-white font-extrabold tracking-tight`}>Make Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ConfirmScreen;


