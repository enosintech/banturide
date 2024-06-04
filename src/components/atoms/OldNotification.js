import {Text, View, TouchableOpacity, PixelRatio } from "react-native";

const OldNotification = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;
    return(
        <TouchableOpacity className={`bg-white h-[100px] justify-center shadow-md w-[95%] mt-2 rounded-[25px] px-3`}>
            <View className={`flex-col justify-center gap-y-1`}>
                <Text style={{fontSize: getFontSize(17)}} className={`font-extrabold tracking-tight`}>{props.title}</Text>
                <Text style={{fontSize: getFontSize(15)}} className={`tracking-tight`}>{props.content}</Text>
                <Text style={{fontSize: getFontSize(13)}} className={`font-extralight tracking-tight
                `}>{props.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default OldNotification;