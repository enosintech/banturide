import {Text, View, TouchableOpacity, PixelRatio } from "react-native";
import { useDispatch } from "react-redux";
import { toggleNotificationStatus } from "../../../slices/notificationSlice";

const NewNotification = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleNotificationStatus(props.id))
    };

    return(
        <TouchableOpacity className={`${props.theme === "dark" ? "bg-[#293240]" : "bg-green-50"} shadow-md w-[95%] mt-2 rounded-[25px] h-[100px] justify-center px-3 relative`}>
            <View className={`flex-col justify-center gap-y-1`}>
                <View className="flex flex-row justify-between">
                    <Text style={{fontSize: getFontSize(17)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>{props.title}</Text>
                    <TouchableOpacity className={`flex flex-row`} onPress={handleToggle}>
                        <Text>Mark as Read</Text>
                        <View className={`h-[18px] w-[18px] ml-2 rounded-[7px] border border-black flex items-center justify-center`}>
                            {props.status === "read" && 
                                <View className={`w-[12px] h-[12px] rounded-[5px] bg-black`}></View>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}>{props.content}</Text>
                <Text style={{fontSize: getFontSize(13)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extralight tracking-tight`}>{props.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NewNotification;