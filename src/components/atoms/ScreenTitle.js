import {Text, View, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const width = Dimensions.get("window").width;

const ScreenTitle = (props) => {

    const fontSize = width * 0.05;

    return(
        <View className="flex-row items-center p-5 w-full h-[10%]">
            <MaterialIcons name={props.iconName} size={fontSize * 1.1} color={props.theme === "dark" ? "white" : "black"}/>
            <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-black"} ml-2 font-medium tracking-tighter`}>{props.title}</Text>
        </View>
    )
}

export default ScreenTitle;