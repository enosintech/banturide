import {Text, View, TouchableOpacity } from "react-native";

const OldNotification = (props) => {
    return(
        <TouchableOpacity className={`bg-white shadow-2xl w-full h-[100px] justify-center px-3`}>
            <View className={`flex-col justify-center`}>
                <Text style={{fontFamily: "os-xb"}} className={`text-[17px]`}>{props.title}</Text>
                <Text style={{fontFamily: "os-reg"}} className={`text-[15px]`}>{props.content}</Text>
                <Text style={{fontFamily: "os-light"}} className={`text-[13px]`}>{props.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default OldNotification;