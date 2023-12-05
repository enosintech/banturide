import { TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const BackButton = (props) => {
    return(
        <TouchableOpacity className="flex-row items-center gap-2 w-[30%]" onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={35} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            <Text style={{fontFamily: "os-light"}} className={`text-[20px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.value}</Text>
        </TouchableOpacity>
    )
}

export default BackButton;