import {Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Favorite = (props) => {
    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-2xl w-full h-[80px] flex justify-center`}>
            <View className={`flex-row items-center justify-between px-3 py-1`}>
                <View className="flex-row items-center">
                    {props.iconName ? 
                    <MaterialIcons name={props.iconName} size={20} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    : 
                    <Ionicons name="location" size={20} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    }
                    <Text style={{fontFamily: "os-mid"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[16px]`}> {props.name}</Text>
                </View>
                <TouchableOpacity>
                    <Entypo name="circle-with-minus" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </TouchableOpacity>
            </View>
            <View className="px-4">
                <Text style={{fontFamily: "os-light"}} className="text-gray-400 text-[12px]">{props.address}</Text>
            </View>
        </View>
    )
}

export default Favorite;