import { View, Text, Dimensions, StyleSheet, PixelRatio, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

import { setPaymentMethod } from '../../../slices/navSlice';

const TogglePayment = () => {
  
  const height = Dimensions.get("window").height;

  const fontScale = PixelRatio.getFontScale();

  const getFontSize = size => size / fontScale;

  const dispatch = useDispatch();
  const navigate = useNavigation();

  return (
    <View 
      style={containerStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={10}
    >
      <View style={{
        height: 0.3 * height
      }} className="w-full flex flex-col bg-white rounded-t-[20px] px-3">
        <View className="w-full h-1/4 flex items-center flex-row">
          <Text style={{fontSize: getFontSize(20)}} className="font-bold tracking-tight">Payment Method</Text>
        </View>
        <View className="w-full h-0 border-[0.5px] border-gray-400"></View>
        <TouchableOpacity className={`w-full h-1/4 flex flex-row items-center`} onPress={() => {
          dispatch(setPaymentMethod("cash"))
          navigate.goBack();
        }}>
          <Ionicons name="cash" color={"green"} size={getFontSize(30)}/>
          <Text style={{fontSize: getFontSize(20)}} className="ml-2">Cash</Text>
        </TouchableOpacity>
        <View className="w-full h-0 border-[0.5px] border-gray-200"></View>
        <TouchableOpacity className={`w-full h-1/4 flex flex-row items-center`} onPress={() => {
          dispatch(setPaymentMethod("mobileMoney"))
          navigate.goBack();
        }}>
          <Entypo name="wallet" color={"black"} size={getFontSize(30)} />
          <Text style={{fontSize: getFontSize(20)}} className="ml-2">Mobile Money</Text>
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