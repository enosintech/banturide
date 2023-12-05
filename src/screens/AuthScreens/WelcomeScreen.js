import { useNavigation } from "@react-navigation/native";
import { Text, View, SafeAreaView, TouchableWithoutFeedback, Keyboard } from "react-native";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { removeItem } from "../../components/lib/asyncStorage";

import LongGreenBtn from "../../components/atoms/LongGreenBtn";
import LongWhiteBtn from "../../components/atoms/LongWhiteBtn";

const WelcomeScreen = (props) => {
    const animation = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        animation.current?.play()
    }, [])

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} h-full w-full flex-col justify-between items-center`} onLayout={props.handleLayout}>
                <View className="w-full h-[70%] flex justify-evenly items-center">
                    <View className="w-[90%] h-[70%]">
                        <LottieView 
                            ref={animation}
                            source={require("../../../assets/animations/welcome.json")}
                            autoPlay
                            loop
                            speed={1}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </View>
                    <View className="w-[90%] flex items-center">
                        <View className={`relative`}>
                            <Text style={{fontFamily: "mic-400"}} className={`text-[35px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>BantuRide</Text>
                            <View className={`absolute -right-2.5 top-2 border rounded-full w-[12px] h-[12px] flex items-center justify-center ${props.theme === "dark" ? "border-white" : "border-black"}`}>
                                <Text style={{fontFamily: "os-xb"}} className={`text-[8px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>R</Text>
                            </View>
                        </View>
                        <Text className={`text-[20px] font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>an e-hailing app for the people</Text>
                    </View>
                </View>
                <View className="h-[25%] w-full flex justify-center items-center ">
                    <LongGreenBtn value="Create an account" handlePress={() => {
                        navigation.navigate("Signup")
                        removeItem("onboarded")
                    }}/>
                    <View className="mt-3"></View>
                    <LongWhiteBtn value="Sign in" handlePress={() => {
                        navigation.navigate("Signin")
                    }}/>
                    <View className="mt-2"></View>
                    <Text style={{fontFamily: "os-light"}} className={`text-[12px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>©{new Date().getFullYear()}. All Rights Reserved</Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default WelcomeScreen;