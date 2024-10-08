import {Text, View, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";

const { width } = Dimensions.get("window");

const TermsAndConditions = (props) => {

    const routes = useRoute();
    const navigation = useNavigation();
    
    const { toggle } = routes.params;

    const [ toggleView, setToggleView ] = useState(toggle);

    const fontSize = width * 0.05;

    return(
            <View className={`${props.theme === "dark" ? "bg-[#222831]" : ""} w-full h-full flex items-center justify-center`}>
                <View className={`w-[90%] h-[90%] ${props.theme === "dark" ? "bg-[#353d4a]" : "bg-white"} rounded-[40px] shadow-sm flex`}>
                    <View className={`w-full h-[10%] flex flex-row items-center justify-center`}>
                        <View className={`w-[80%] h-[60%] rounded-[25px] flex flex-row overflow-hidden shadow-lg border-gray-100 border bg-white`}>
                            <TouchableOpacity onPress={() => {setToggleView("tncs")}} className={`w-1/2 h-full ${toggleView === "tncs" ? "bg-[#186f65]" : "bg-white"} flex items-center justify-center rounded-[25px]`}>
                                <Text style={{fontSize: fontSize * 0.7}} className={`${toggleView === "tncs" ? "text-white" : "text-black"} font-medium tracking-tight`}>Terms & Conditions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToggleView("pps")} className={`w-1/2 h-full ${toggleView === "tncs" ? "bg-white" : "bg-[#186f65]"} flex items-center justify-center rounded-[25px]`}>
                                <Text style={{fontSize: fontSize * 0.7}} className={`${toggleView === "tncs" ? "text-black" : "text-white"} font-medium tracking-tight`}>Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className={`w-full h-[75%]`}>
                        {toggleView === "tncs" 
                        ?
                            <View className="w-full h-full bg-red-500"></View>
                        :
                            <View className="w-full h-full bg-blue-500"></View>
                        }
                    </View>
                    <View className={`w-full h-[15%] flex items-center justify-center`}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack()
                        }} className="w-[85%] h-[50%] rounded-[30px] bg-[#186f65] flex items-center justify-center">
                            <Text style={{fontSize: fontSize * 0.85}} className="text-white font-bold tracking-tight">I understand the {toggleView === "tncs" ? "T's & C's" : "Privacy Policy"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    )
}

export default TermsAndConditions;