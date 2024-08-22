import {Text, TouchableOpacity, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const BurgerMenuItem = (props) => {

    const fontSize = width * 0.05;

    return(
        <TouchableOpacity className={`h-[18%] w-full border-b-[0.5px]  border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={props.handlePress}>
            <MaterialIcons name={props.iconName} size={fontSize * 1.6} color={`${props.theme === "dark" ? "white" : "#186F65"}`}/>
            <Text style={{fontSize: fontSize * 0.75}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default BurgerMenuItem;