import {Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ScreenTitle = (props) => {
    return(
        <View className="flex-row items-center p-5 w-full h-[10%]">
            <MaterialIcons name={props.iconName} size={30} color="#186F65"/>
            <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} ml-2 text-[30px]`}>{props.title}</Text>
        </View>
    )
}

export default ScreenTitle;