import {Text, View, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const width = Dimensions.get("window").width;

const ScreenTitle = (props) => {

    const fontSize = width * 0.05;

    return(
        <View className="flex-row items-center p-5 w-full h-[10%]">
            <MaterialIcons name={props.iconName} size={fontSize * 1.6} color="#186F65"/>
            <Text style={{fontSize: fontSize * 1.6}} className={`${props.theme === "dark" ? "text-white" : "text-black"} ml-2 font-bold tracking-tight`}>{props.title}</Text>
        </View>
    )
}

export default ScreenTitle;