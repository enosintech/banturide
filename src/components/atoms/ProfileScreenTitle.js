import { TouchableOpacity, Text, View, PixelRatio } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ProfileScreenTitle = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
        <TouchableOpacity className="flex-row items-center gap-2 w-[40%]" onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={getFontSize(35)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            <View className={`flex-row items-center`}>
                <MaterialIcons name={props.iconName} size={getFontSize(40)} color={`${props.theme === "dark" ? "white" : "#186f65"}`} />
                <Text style={{fontSize: getFontSize(20)}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}> {props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProfileScreenTitle;