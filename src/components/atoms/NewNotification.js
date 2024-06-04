import {Text, View, TouchableOpacity, PixelRatio } from "react-native";

const NewNotification = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
        <TouchableOpacity className={`${props.theme === "dark" ? "bg-[#293240]" : "bg-green-50"} shadow-md w-[95%] mt-2 rounded-[25px] h-[100px] justify-center px-3`}>
            <View className={`flex-col justify-center gap-y-1`}>
                <Text style={{fontSize: getFontSize(17)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>{props.title}</Text>
                <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}>{props.content}</Text>
                <Text style={{fontSize: getFontSize(13)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extralight tracking-tight`}>{props.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NewNotification;