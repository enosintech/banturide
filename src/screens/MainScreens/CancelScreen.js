import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, PixelRatio, Modal } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';

import ModalLoader from "../../components/atoms/ModalLoader.js";

import { selectBooking, setBooking, setDestination, setDriver, setHasArrived, setOnTheWay, setOrigin, setPassThrough, setPrice, setSchoolPickup, setToggle, setTravelTimeInformation, setTripDetails, setTripType, setSearchComplete, setBookingRequested, setSearchPerformed } from '../../../slices/navSlice';
import { selectToken } from '../../../slices/authSlice';

const fontScale = PixelRatio.getFontScale();

const getFontSize = size => size / fontScale;

const RadioButton = ({ selected, onSelect, theme }) => (
    <TouchableOpacity onPress={onSelect} className={`${selected && theme === "dark" ? "bg-[#383a3f]" : selected && theme === "light" ? "bg-white" : ""} w-[90%] h-[60px] rounded-[20px] flex justify-center px-5`}>
        <Text style={{fontSize: getFontSize(18)}} className={`${theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Driver took too long to respond</Text>
    </TouchableOpacity>
)

const CancelScreen = (props) => {

    const [ selected, setSelected ] = useState(null);
    const [ loading, setLoading ] = useState(false)

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const tokens = useSelector(selectToken);
    const booking = useSelector(selectBooking);

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
            reason: selected,
          })
        })
        .then(response => response.json())
        .then(data => {
          if(data.success === false){
            setLoading(false)
            console.log(data.message)
          } else {
            setLoading(false)
            dispatch(setDestination(null))
            dispatch(setOrigin(null))
            dispatch(setPrice(null))
            dispatch(setTravelTimeInformation(null))
            dispatch(setTripDetails(null))
            dispatch(setPassThrough(null))
            dispatch(setBooking(null))
            dispatch(setBookingRequested(false))
            dispatch(setSearchPerformed(false))
            dispatch(setSearchComplete(false))
            navigation.goBack();
            navigation.navigate("Home")
          }
        })
      } 

  return (
    <View style={containerStyles.container}>
      <View className={`w-full h-[70%] rounded-t-[16px] flex ${props.theme === "dark" ? "bg-[#202227]" : "bg-gray-100"}`}>

        <Modal transparent={true} animationType="fade" visible={loading} presentationStyle={"overFullScreen"} onRequestClose={() => {
                if(loading === true){
                    return
                } else {
                    setLoading(false)
                }
             }}>
                <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
                    <ModalLoader />
                </View>
             </Modal>

        <View className={`w-full h-[15%] flex justify-center px-5`}>
            <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Tell us why</Text>
            <Text style={{fontSize: getFontSize(14)}} className={`mt-1 ${props.theme === "dark" ? "text-white" : "text-black"} font-light`}>We value your Feedback and are always looking to improve</Text>
        </View>
        <View className={`w-full h-[60%]`}>
            <ScrollView contentContainerStyle={{
                display: 'flex',
                alignItems: "center"
            }}>
                {[{item: 1}, {item: 2}, {item: 3}, {item: 4}, {item: 5}, {item: 6}, {item: 7}, {item: 8}].map((item, index) => (
                    <RadioButton selected={selected === item.item } key={item.item} theme={props.theme} onSelect={() => setSelected(item.item)} {...item}/>
                ))}
            </ScrollView>
        </View>
        <View className={`w-full h-[22%] items-center justify-evenly`}>
            <View className={`w-[95%] h-[85%] shadow-md border flex flex-row-reverse rounded-t-[20px] rounded-b-[30px] items-center justify-evenly ${props.theme === "dark" ? "": "bg-white border-gray-100"}`}>
                <TouchableOpacity disabled={true} className={`w-[45%] h-[70%] opacity-30 rounded-[16px] bg-[#186f65] flex items-center justify-center`} onPress={() => {
                    dispatch(setDriver(null));
                    dispatch(setHasArrived(false));
                    dispatch(setOnTheWay(false));
                }}>
                    <Text style={{fontSize: getFontSize(16)}} className={`text-white font-extrabold tracking-tight`}>Find New Driver</Text>
                    <Text style={{fontSize: getFontSize(13)}} className={`text-white font-light tracking-tight`}>Coming Soon</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={!selected ? true : false} className={`w-[45%] h-[70%] rounded-[16px] bg-red-600 flex items-center justify-center ${!selected ? "opacity-25" : "opacity-100"}`} onPress={handleCancelBooking}>
                    <Text style={{fontSize: getFontSize(18)}} className={`font-extrabold tracking-tight text-white`}>Cancel Trip</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}

export default CancelScreen;

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "column"
    }
})