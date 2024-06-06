import {Text, TouchableOpacity, View, PixelRatio, Modal } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ModalLoader from "./ModalLoader";
import { selectFavAddressChanged, setFavAddressChanged } from "../../../slices/navSlice";

const Favorite = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    const [ loading, setLoading ] = useState(false);
    const [ modalVisible, setModalVisible ] = useState(false);

    const favAddressChanged = useSelector(selectFavAddressChanged);

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const favAddressForm = {
        userId: props._id
    }

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(favAddressForm)
    }

    const handleDeleteFavAddress = async () => {
        setModalVisible(false)
        setLoading(true)
        try {
            const response = await fetch("https://banturide.onrender.com/favorites/favorites", options)
            const result = await response.json();
            dispatch(setFavAddressChanged(!favAddressChanged))
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-[95%] h-[85px] mb-1 mt-1 flex justify-center rounded-[25px]`}>

            <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
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
            
            <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="fade" transparent={true}>
                <View style={{backgroundColor: "rgba(0,0,0,0.7)"}} className={`w-full h-full flex justify-end`}>
                    <View className={`w-full h-[30%] ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow rounded-t-[30px] flex items-center justify-evenly`}>
                        <Text style={{fontSize: getFontSize(18)}} className={`text-center w-[80%] font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Are you sure you want to remove this Saved Address?</Text>
                        <View className="flex flex-row items-center justify-evenly w-full h-[40%]">
                            <TouchableOpacity onPress={() => setModalVisible(false)} className={`w-[40%] h-[70%] bg-red-600 rounded-[40px] flex items-center justify-center`}>
                                <Text style={{fontSize: getFontSize(18)}} className="text-white font-bold tracking-tight">Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteFavAddress} className={`w-[40%] h-[70%] bg-[#186f65] rounded-[40px] flex items-center justify-center`}>
                                <Text style={{fontSize: getFontSize(18)}} className="text-white font-bold tracking-tight">Remove Address</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View className={`flex-row items-center justify-between px-3 py-2`}>
                <View className="flex-row items-center -translate-y-1">
                    {props.iconName ? 
                    <MaterialIcons name={props.iconName} size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    : 
                    <Ionicons name="location" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    }
                    <Text style={{fontSize: getFontSize(18)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}> {props.addName}</Text>
                </View>
                <View className="flex flex-row gap-x-1 -translate-y-2 -translate-x-1">
                    <TouchableOpacity onPress={() => {
                        if(props.iconName && props.iconName === "home-filled"){
                            navigation.navigate("addhome")
                        } else if(props.iconName && props.iconName === "work"){
                            navigation.navigate("addwork")
                        } else {
                            navigation.navigate("addlocation")
                        }
                    }}>
                        <MaterialCommunityIcons name="circle-edit-outline" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true)
                    }}>
                        <Entypo name="circle-with-minus" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="px-4 -translate-y-1">
                <Text style={{fontSize: getFontSize(11)}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.address}</Text>
            </View>
        </View>
    )
}

export default Favorite;