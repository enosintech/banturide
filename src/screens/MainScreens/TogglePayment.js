import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

import { selectBooking, setBooking, setPaymentMethod, setPaymentMethodUpdated } from '../../../slices/navSlice';
import { selectToken } from '../../../slices/authSlice';

import ModalLoader from "../../components/atoms/ModalLoader.js"

const { width } = Dimensions.get("window");

const TogglePayment = (props) => {
  
  const height = Dimensions.get("window").height;

  const fontSize = width * 0.05;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [ loading, setLoading ] = useState(false);

  const tokens = useSelector(selectToken);
  const booking = useSelector(selectBooking);

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
            setLoading(false)
            console.log(data.error)
          } else {
            dispatch(setBooking(JSON.parse(data.booking)))
            setLoading(false)
            navigation.navigate("driver", {updatedPaymentMessage: "Payment Method Updated Successfully!"})
            dispatch(setPaymentMethodUpdated(true))
          }
      })
    } catch (error) {
      console.log("Error updating payment method: ", error)
    }
  }

  return (
    <View 
      style={containerStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={10}
    >

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
        <View className="w-full h-1/4 flex items-center flex-row">
          <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Payment Method</Text>
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
    </View>
  )
}

export default TogglePayment;

const containerStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "flex-end",
      flexDirection: "column",
  },
})