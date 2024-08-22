import { TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const BackButton = (props) => {

    const fontSize = width * 0.05;

    return(
        <TouchableOpacity className={`flex-row flex justify-center items-center w-14 h-14 shadow-sm ${props.theme === "dark" ? "bg-gray-500" : "border-gray-100 border bg-white" } rounded-full`} onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={fontSize * 1.6} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
    )
}

export default BackButton;