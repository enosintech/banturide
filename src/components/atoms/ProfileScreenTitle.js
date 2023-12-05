import { TouchableOpacity, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ProfileScreenTitle = (props) => {
    return(
        <TouchableOpacity className="flex-row items-center gap-2 w-[40%]" onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={35} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            <View className={`flex-row items-center`}>
                <MaterialIcons name={props.iconName} size={40} color={`${props.theme === "dark" ? "white" : "#186f65"}`} />
                <Text style={{fontFamily: "os-light"}} className={`text-[20px] ${props.theme === "dark" ? "text-white" : "text-[#186f65]"}`}> {props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProfileScreenTitle;