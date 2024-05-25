import {Text, View, TouchableOpacity } from "react-native";

const NewNotification = (props) => {
    return(
        <TouchableOpacity className={`${props.theme === "dark" ? "bg-[#293240]" : "bg-green-50"} shadow-2xl w-full h-[100px] justify-center px-3`}>
            <View className={`flex-col justify-center`}>
                <Text style={{fontFamily: "os-xb"}} className={`text-[17px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.title}</Text>
                <Text style={{fontFamily: "os-reg"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.content}</Text>
                <Text style={{fontFamily: "os-light"}} className={`text-[13px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.time}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NewNotification;