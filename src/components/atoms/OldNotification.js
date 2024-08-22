import {Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch } from "react-redux";

import { toggleNotificationStatus } from "../../../slices/notificationSlice";

const { width } = Dimensions.get("window");

const OldNotification = (props) => {

    const fontSize = width * 0.05;

    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleNotificationStatus(props.id))
    };

    return(
        <View className={`bg-white h-[100px] justify-center shadow-sm w-[95%] mt-2 rounded-[25px] px-3`}>
            <View className={`flex-col justify-center gap-y-1`}>
                <View className="flex flex-row justify-between">
                <Text style={{fontSize: fontSize * 0.7}} className={`font-extrabold tracking-tight`}>{props.title}</Text>
                    <TouchableOpacity className={`flex flex-row`} onPress={handleToggle}>
                        <Text style={{fontSize: fontSize * 0.6}} className={`text-black`}>Mark as Unread</Text>
                        <View className={`h-[18px] w-[18px] ml-2 rounded-[7px] border border-black flex items-center justify-center`}>
                            {props.status === "read" && 
                                <View className={`w-[12px] h-[12px] rounded-[5px] bg-black`}></View>
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: fontSize * 0.65}} className={`tracking-tight`}>{props.content}</Text>
                <Text style={{fontSize: fontSize * 0.55}} className={`font-extralight tracking-tight
                `}>{props.time}</Text>
            </View>
        </View>
    )
}

export default OldNotification;