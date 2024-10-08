import { Text, View, Image, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import LongWhiteBtn from "../../components/atoms/LongWhiteBtn";
import { useSelector } from "react-redux";
import { selectGlobalUnauthorizedError } from "../../../slices/authSlice";

const { width } = Dimensions.get("window");

const WelcomeScreen = (props) => {

    const navigation = useNavigation();

    const fontSize = width * 0.05

    const globalUnauthorizedEror = useSelector(selectGlobalUnauthorizedError);

    return(
        <View className={`${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} h-full w-full flex-col items-center relative`} onLayout={props.handleLayout}>

            {globalUnauthorizedEror &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit px-6 h-[90%] bg-black rounded-[50px] flex items-center justify-center`}>
                        <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-medium text-center tracking-tight">{globalUnauthorizedEror}</Text>
                    </View>
                </View>
            }
            
            <View className="w-full h-[30%] flex justify-start items-center translate-y-10">
                <Image 
                    source={require("../../../assets/icons/BantuRide.png")}
                    style={styles.image}
                />
            </View>
            <View className="h-[40%] bg-[#186f65] rounded-[25px] shadow w-[90%] flex justify-center items-center mt-6">
                <LongWhiteBtn value="Create account" handlePress={() => {
                    navigation.navigate("Signup")
                }}/>
                <View className="mt-4"></View>
                <LongWhiteBtn value="Sign in" handlePress={() => {
                    navigation.navigate("Signin")
                }}/>
            </View>
            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" ? "text-white" : "text-neutral-800"} font-semibold tracking-tighter absolute bottom-10 opacity-80`}>©{new Date().getFullYear()} All Rights Reserved</Text>
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