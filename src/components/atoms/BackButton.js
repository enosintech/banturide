import { TouchableOpacity, Text, PixelRatio } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const BackButton = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
        <TouchableOpacity className="flex-row flex justify-center items-center w-14 h-14 shadow-sm border-gray-100 border bg-white rounded-full" onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={getFontSize(35)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
        </TouchableOpacity>
    )
}

export default BackButton;