import {Text, View, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";

import ProfileScreenTitle from "../../components/atoms/ProfileScreenTitle";

const { width } = Dimensions.get("window");

const AboutScreen = (props) => {
    const navigation = useNavigation();

    const [ aboutToggle, setAboutToggle ] = useState("tncs");

    const fontSize = width * 0.05;

    return(
        <SafeAreaView className={`${props.theme === "dark"? "bg-[#222831]" : ""} w-full h-full`}>
            
            <View className={`w-full h-[10%] p-3`}>
                <ProfileScreenTitle theme={props.theme} iconName={"info"} title="About" handlePress={() => {
                    navigation.goBack();
                }} />
            </View>

            <View className="w-full h-[15%] flex flex-col items-center justify-center">
                <Text style={{fontSize: fontSize * 1.2}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Banturide</Text>
                <Text style={{fontSize: fontSize * 0.8}} className={`mt-2 font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-neutral-700"}`}>Version 1.0.0 Released TBD</Text>
            </View>

            <View className={`w-full h-[60%]`}>
                <View className={`w-full h-[15%] flex items-center justify-center`}>
                    <View className={`w-[70%] h-[60%] shadow bg-white rounded-[25px] flex flex-row`}>
                        <TouchableOpacity onPress={() => {
                            setAboutToggle("tncs")
                        }} className={`w-1/2 h-full rounded-[25px] flex items-center justify-center ${aboutToggle === "tncs" ? "bg-[#186f65]" : "bg-white"}`}>
                            <Text style={{fontSize: fontSize * 0.6}} className={`${aboutToggle === "tncs" ? "text-white" : "text-black"} font-medium tracking-tight`}>Terms & Conditions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setAboutToggle("pp")
                        }} className={`w-1/2 h-full rounded-[25px] flex items-center justify-center ${aboutToggle === "tncs" ? "bg-white" : "bg-[#186f65]"}`}>
                            <Text style={{fontSize: fontSize * 0.6}} className={`${aboutToggle === "tncs" ? "text-black" : "text-white"} font-medium tracking-tight`}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={`w-full h-[85%]`}>
                    {
                        aboutToggle === "tncs" 
                        ?
                        <View className={`w-full h-full bg-red-500`}>

                        </View>
                        :
                        <View className={`w-full h-full bg-orange-500`}>

                        </View>
                    }
                </View>
            </View>

            <View className={`w-full h-[10%] flex items-center justify-center`}>
                <TouchableOpacity className={`w-[35%] h-[60%] bg-[#186f65] rounded-full flex flex-row items-center justify-center`}>
                    <Feather name="globe" size={fontSize * 1.25} color="white" />
                    <Text style={{fontSize: fontSize * 0.7}} className={`ml-2 text-white font-bold tracking-tight`}>Visit Website</Text>
                </TouchableOpacity> 
            </View>

        </SafeAreaView>
    )
}

export default AboutScreen;