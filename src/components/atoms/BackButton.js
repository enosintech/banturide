import { TouchableOpacity, Text, PixelRatio } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const BackButton = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
        <TouchableOpacity className="flex-row items-center gap-2 w-[30%]" onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={getFontSize(35)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>{props.value}</Text>
        </TouchableOpacity>
    )
}

export default BackButton;