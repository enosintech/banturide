import {Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const BurgerMenuItem = (props) => {
    return(
        <TouchableOpacity className={`h-[10%] w-full border-b-[0.5px]  border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={props.handlePress}>
            <MaterialIcons name={props.iconName} size={30} color={`${props.theme === "dark" ? "white" : "#186F65"}`}/>
            <Text style={{fontFamily: "os-light"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>  {props.text}</Text>
        </TouchableOpacity>
    )
}

export default BurgerMenuItem;