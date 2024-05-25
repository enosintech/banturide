import {Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";

const PaymentMethods = (props) => {
    return(
        <View className="flex-1 flex-col justify-end">
            <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[60%] rounded-t-2xl`}>
                <View className={`w-full h-[3%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className="flex-row items-center p-5 w-full h-[18%]">
                    <MaterialIcons name="payments" size={30} color="#186F65"/>
                    <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} ml-2 text-[30px]`}>Payment Methods</Text>
                </View>
                <View className={`border-b-[1px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
                <TouchableOpacity className={`h-[12%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} flex-row items-center justify-between px-3 shadow-2xl`}>
                    <View className="flex-row items-center">
                        <MaterialIcons name="payments" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        <Text style={{fontFamily: "os-reg"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px]`}> Add Payment Method</Text>
                    </View>
                    <View>
                        <MaterialIcons name="add" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    </View>
                </TouchableOpacity>
                <View className={`w-full h-[10%] ${props.theme === "dark" ? "bg-[#222831] border-gray-900" : "bg-white border-gray-200"} p-3 border-b-[0.25px] border-solid shadow-2xl`}>
                    <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[20px]`}>Saved Methods</Text>
                </View>
                <View className={`w-full h-[50%] items-center p-5`}>
                    <Text style={{fontFamily: "os-light"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Saved Payment Methods</Text>
                </View>
            </View>
        </View>
    )
}

export default PaymentMethods;

