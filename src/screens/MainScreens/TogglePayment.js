import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { PanGestureHandler } from "react-native-gesture-handler"
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

import { selectBooking, setBooking, setDeliveryType, setDestination, setOrigin, setPassThrough, setPaymentMethod, setPaymentMethodUpdated, setPrice, setRecipient, setTravelTimeInformation, setTripDetails } from '../../../slices/navSlice';
import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from '../../../slices/authSlice';

import ModalLoader from "../../components/atoms/ModalLoader.js"
import ShortModalNavBar from '../../components/atoms/ShortModalNavBar';

const { width } = Dimensions.get("window");

const TogglePayment = (props) => {
  
  const height = Dimensions.get("window").height;

  const fontSize = width * 0.05;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);

  const tokens = useSelector(selectToken);
  const booking = useSelector(selectBooking);
  const isSignedIn = useSelector(selectIsSignedIn);

  const { goBack } = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: translateY } }],
      { useNativeDriver: true }
  )

  const onHandlerStateChange = useCallback(
      ({nativeEvent}) => {
          if (nativeEvent.state === 5) { // 5 is the value for `END` state
              if (nativeEvent.translationY > 150) { // Adjust threshold as needed
                  goBack(); // Close the modal
              } else {
                  Animated.spring(translateY, {
                  toValue: 0,
                  useNativeDriver: true,
                  }).start();
              }
          }
      },
      [goBack, translateY]
  )

  const translateYClamped = translateY.interpolate({
    inputRange: [0, 9999],  // Large range to allow normal dragging
    outputRange: [0, 9999], // Mirrors input but clamps the lower bound to 0
    extrapolate: 'clamp',
  });

  const handleChangePayment = async (passedPaymentMethod) => {
    setLoading(true)
    try {
      const response = await fetch("https://banturide-api.onrender.com/payment/update-payment", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens?.idToken}`,
            'x-refresh-token' : tokens?.refreshToken,
        },
        body: JSON.stringify({
          bookingId: booking?.bookingId,
          paymentMethod: passedPaymentMethod 
        })
      })

      await response.json()
      .then((data) => {
          if(data.success === false) {
            throw new Error(data.message || data.error)
          } else {
            setLoading(false)
            dispatch(setBooking(JSON.parse(data.booking)))
            navigation.navigate("driver", {updatedPaymentMessage: `Payment Method Set to ${passedPaymentMethod === "mobileMoney" ? "Mobile Money" : "Cash"}`})
            dispatch(setPaymentMethodUpdated(true))
            setTimeout(() => {
              dispatch(setPaymentMethodUpdated(false))
            }, 5000)
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
        .catch(() => {
          setLoading(false)
          setError("Something went wrong. Unauthorized")
          setTimeout(() => {
            setError(false)
          }, 3000)
        })
      } else {
        setLoading(false)
        setError(errorField || "Error updating payment method")
        setTimeout(() => {
          setError(false)
        }, 3000)
      }
    }
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View 
        style={[containerStyles.container, { transform: [{ translateY: translateYClamped }]}]}
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={10}
      >

        {error &&
            <View className={`w-full h-[6%] absolute z-20 top-20 flex items-center justify-center`}>
                <View className={`w-fit px-6 h-[90%] bg-red-600 rounded-[50px] flex items-center justify-center`}>
                    <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-medium text-center tracking-tight">{error}</Text>
                </View>
            </View>
        }

        <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
          if(loading === true){
              return
          } else {
              setLoading(false)
          }
        }}>
          <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
              <ModalLoader theme={props.theme} loading={loading}/>
          </View>
        </Modal>

        <View style={{
          height: 0.3 * height
        }} className={`w-full flex flex-col ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} rounded-t-[40px] px-3`}>
          <View className="w-full h-1/4 flex items-center justify-center flex-row relative">
            <View className={`w-full h-[20%] absolute top-0 left-0 flex items-center justify-center`}>
                <ShortModalNavBar theme={props.theme} />
            </View>
            <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>Payment Method</Text>
          </View>
          <View className="w-full h-0 border-[0.5px] border-gray-400"></View>
          <TouchableOpacity className={`w-full h-1/4 flex flex-row items-center`} onPress={() => {
            dispatch(setPaymentMethod("cash"))
            if(booking){
              handleChangePayment("cash")
            } else {
              navigation.goBack();
            }
          }}>
            <Ionicons name="cash" color={"green"} size={fontSize * 1.6}/>
            <Text style={{fontSize: fontSize}} className={`ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Cash</Text>
          </TouchableOpacity>
          <View className="w-full h-0 border-[0.5px] border-gray-200"></View>
          <TouchableOpacity className={`w-full h-1/4 flex flex-row items-center`} onPress={() => {
            dispatch(setPaymentMethod("mobileMoney"))
            if(booking){
              handleChangePayment("mobileMoney")
            } else {
              navigation.goBack();
            }
          }}>
            <Entypo name="wallet" color={props.theme === "dark" ? "white" : "black"} size={fontSize * 1.6} />
            <Text style={{fontSize: fontSize}} className={`ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Mobile Money</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default TogglePayment;

const containerStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "flex-end",
      flexDirection: "column",
      position: "relative"
  },
})