import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const ProfileScreenTitle = (props) => {

    const fontSize = width * 0.05;

    return(
        <TouchableOpacity className="flex-row items-center gap-2 w-[40%]" onPress={props.handlePress}>
            <Ionicons name="chevron-back" size={fontSize * 1.8} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            <View className={`flex-row items-center`}>
                <MaterialIcons name={props.iconName} size={fontSize * 2} color={`${props.theme === "dark" ? "white" : "#186f65"}`} />
                <Text style={{fontSize: fontSize}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}> {props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProfileScreenTitle;