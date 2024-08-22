import { Text, View, Image, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import LongWhiteBtn from "../../components/atoms/LongWhiteBtn";

const { width } = Dimensions.get("window");

const WelcomeScreen = (props) => {

    const navigation = useNavigation();

    const fontSize = width * 0.05

    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : ""} h-full w-full flex-col items-center relative`} onLayout={props.handleLayout}>
            <View className="w-full h-[30%] flex justify-start items-center translate-y-10">
                <Image 
                    source={require("../../../assets/icons/BantuRide.png")}
                    style={styles.image}
                />
            </View>
            <View className="h-[40%] bg-[#186f65] rounded-[40px] shadow-sm w-[90%] flex justify-center items-center translate-y-6">
                <LongWhiteBtn value="Create an account" handlePress={() => {
                    navigation.navigate("Signup")
                }}/>
                <View className="mt-3"></View>
                <LongWhiteBtn value="Sign in" handlePress={() => {
                    navigation.navigate("Signin")
                }}/>
            </View>
            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" ? "text-white" : "text-neutral-800"} font-medium tracking-tight absolute bottom-10 opacity-80`}>©{new Date().getFullYear()} All Rights Reserved</Text>
        </View>
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    image: {
        width: width * 0.75,
        height: width * 0.8,
        resizeMode: 'contain', 
    },
});