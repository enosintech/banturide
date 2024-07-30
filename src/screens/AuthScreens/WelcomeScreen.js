import { useNavigation } from "@react-navigation/native";
import { Text, View, SafeAreaView, TouchableWithoutFeedback, Keyboard, PixelRatio, Platform, StyleSheet, StatusBar } from "react-native";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LongGreenBtn from "../../components/atoms/LongGreenBtn";
import LongWhiteBtn from "../../components/atoms/LongWhiteBtn";

let insetTop;
let insetBottom;

const WelcomeScreen = (props) => {
    const navigation = useNavigation();

    const fontScale = PixelRatio.getFontScale();

    const insets = useSafeAreaInsets();

    insetTop = insets.top;
    insetBottom = insets.bottom;

    const getFontSize = size => size / fontScale;

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={safeViewAndroid.AndroidSafeArea} className={`${props.theme === "dark" ? "bg-[#222831]" : ""} h-full w-full flex-col justify-between items-center`} onLayout={props.handleLayout}>
                <View className="w-full h-[70%] flex justify-evenly items-center">
                    <View className="w-[90%] items-center h-[70%]">
                        <LottieView 
                            source={require("../../../assets/animations/welcome.json")}
                            autoPlay
                            loop
                            speed={1}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </View>
                    <View className="w-[90%] flex items-center">
                        <View className={`relative`}>
                            <Text style={{fontFamily: "mic-400", fontSize: getFontSize(35)}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>BantuRide</Text>
                            <View className={`absolute -right-2.5 top-2 border rounded-full w-[12px] h-[12px] flex items-center justify-center ${props.theme === "dark" ? "border-white" : "border-black"}`}>
                                <Text style={{fontSize: getFontSize(8)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold`}>R</Text>
                            </View>
                        </View>
                        <Text style={{fontSize: getFontSize(18)}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>an e-hailing app for the people</Text>
                    </View>
                </View>
                <View className="h-[23%] bg-white rounded-[20px] shadow w-[90%] flex justify-center items-center ">
                    <LongGreenBtn value="Create an account" handlePress={() => {
                        navigation.navigate("Signup")
                    }}/>
                    <View className="mt-3"></View>
                    <LongWhiteBtn value="Sign in" handlePress={() => {
                        navigation.navigate("Signin")
                    }}/>
                    <View className="mt-2"></View>
                    <Text style={{fontSize: getFontSize(12)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>©{new Date().getFullYear()}. All Rights Reserved</Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default WelcomeScreen;

export const safeViewAndroid = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingBottom: Platform.OS === "android" ? 30 : 0
    }
})