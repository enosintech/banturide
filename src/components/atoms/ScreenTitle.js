import {Text, View, PixelRatio } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ScreenTitle = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
        <View className="flex-row items-center p-5 w-full h-[10%]">
            <MaterialIcons name={props.iconName} size={getFontSize(30)} color="#186F65"/>
            <Text style={{fontSize: getFontSize(30)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} ml-2 font-bold tracking-tight`}>{props.title}</Text>
        </View>
    )
}

export default ScreenTitle;