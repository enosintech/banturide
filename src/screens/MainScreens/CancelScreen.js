import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux';

import { setBooking, setDestination, setDriver, setHasArrived, setOnTheWay, setOrigin, setPassThrough, setPrice, setSchoolPickup, setToggle, setTravelTimeInformation, setTripDetails, setTripType } from '../../../slices/navSlice';

const RadioButton = ({ selected, onSelect, theme }) => (
    <TouchableOpacity onPress={onSelect} className={`${selected && theme === "dark" ? "bg-[#383a3f]" : selected && theme === "light" ? "bg-white" : ""} w-[90%] h-[60px] rounded-[20px] flex justify-center px-5`}>
        <Text style={{fontFamily: "os-b"}} className={`${theme === "dark" ? "text-white" : "text-black"} text-[18px]`}>Driver took too long to respond</Text>
    </TouchableOpacity>
)

const CancelScreen = (props) => {

    const [ selected, setSelected ] = useState(null);

    const dispatch = useDispatch();
    const navigation = useNavigation();

  return (
    <View style={containerStyles.container}>
      <View className={`w-full h-[70%] rounded-t-[16px] flex ${props.theme === "dark" ? "bg-[#202227]" : "bg-gray-100"}`}>
        <View className={`w-full h-[15%] flex justify-center px-5`}>
            <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-xl`}>Tell us why</Text>
            <Text style={{fontFamily: "os-light"}} className={`mt-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>We value your Feedback and are always looking to improve</Text>
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
                <TouchableOpacity disabled={!selected ? true : false} className={`w-[45%] h-[70%] rounded-[16px] bg-[#186f65] flex items-center justify-center ${!selected ? "opacity-25" : "opacity-100"}`} onPress={() => {
                    dispatch(setDriver(null));
                    dispatch(setHasArrived(false));
                    dispatch(setOnTheWay(false));
                }}>
                    <Text style={{fontFamily: "os-xb"}} className={`text-[16px] text-white`}>Find New Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={!selected ? true : false} className={`w-[45%] h-[70%] rounded-[16px] bg-red-600 flex items-center justify-center ${!selected ? "opacity-25" : "opacity-100"}`} onPress={() => {
                    dispatch(setOrigin(null));
                    dispatch(setPassThrough(null));
                    dispatch(setDestination(null));
                    dispatch(setTravelTimeInformation(null));
                    dispatch(setToggle("ride"));
                    dispatch(setTripDetails(null));
                    dispatch(setPrice(null));
                    dispatch(setBooking(false));
                    dispatch(setTripType("normal"));
                    dispatch(setSchoolPickup(false));
                    dispatch(setDriver(null));
                    dispatch(setHasArrived(false));
                    dispatch(setOnTheWay(false));
                    navigation.navigate("Home");
                }}>
                    <Text style={{fontFamily: "os-xb"}} className={`text-[16px] text-white`}>Cancel Trip</Text>
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