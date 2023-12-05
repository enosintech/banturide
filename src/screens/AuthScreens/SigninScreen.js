import {SafeAreaView, Text, View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

import BackButton from "../../components/atoms/BackButton";


const SigninScreen = (props) => {
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className={`${props.theme === "light" ? "bg-white" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} h-full w-full flex-col items-center`}>
                <View className="w-full h-[10%]">
                    <View className="w-full pl-2 pt-2">
                        <BackButton theme={props.theme} value="Back" handlePress={() => {
                            navigation.goBack();
                        }}/>
                    </View>
                </View>
                <View className="mt-5"></View>
                <View className="h-[40%] w-full flex items-center">
                    <View className="h-[25%]">
                        <Text style={{fontFamily: "os-mid"}} className={`text-[30px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign in with your Email</Text>
                    </View>
                    <View className={`h-[55%] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} w-[90%] rounded-2xl flex items-center justify-center mt-5 border-[0.25px]`}>
                        <TextInput
                            className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[30%] w-[90%] border-[0.25px] p-2 text-[15px] border-solid rounded-xl`} 
                            placeholder="Email or Phone Number"
                            style={{fontFamily: "os-sb"}}
                            placeholderTextColor="rgb(156 163 175)"
                        />
                        <View className={`h-[30%] mt-5 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-xl flex-row items-center p-2`}>
                            <TextInput
                                className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"}`}
                                placeholder="Password"
                                style={{fontFamily: "os-sb"}}
                                placeholderTextColor="rgb(156 163 175)"
                                secureTextEntry={!visible}
                            />
                            <TouchableOpacity onPress={() => {
                                setVisible(!visible)
                            }}>
                                <MaterialIcons name={`${visible === true ? "visibility": "visibility-off"}`} size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity className="w-full h-[15%]" onPress={() => {
                            navigation.navigate("Forgot")
                        }}>
                            <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[14px] px-7 mt-2 text-right`}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View className="h-[40%] w-full flex items-center justify-center">
                    <TouchableOpacity className="bg-[#186F65] shadow-lg w-[85%] h-[20%] rounded-2xl flex justify-center items-center">
                        <Text style={{fontFamily: "os-b"}} className="text-[17px] text-white">Sign in</Text>
                    </TouchableOpacity>
                    <Text className={`${props.theme === "dark" ? "text-white" : "text-gray-400"} text-[15px] mt-5`} style={{fontFamily: "os-sb"}}>- or -</Text>
                    <View className="mt-5"></View>
                    <TouchableOpacity className="bg-gray-200 shadow-2xl w-[85%] h-[20%] rounded-2xl flex-row justify-center items-center">
                        <Image source={require("../../../assets/images/Google.png")} className="object-contain h-[25px] w-[25px]"/>
                        <Text style={{fontFamily: "os-sb"}} className="text-black text-[17px] ml-2">Sign in with Google</Text>
                    </TouchableOpacity>
                    <View className="mt-5"></View>
                    <TouchableOpacity className="bg-white shadow-2xl w-[85%] h-[20%] rounded-2xl flex-row justify-center items-center">
                            <Image source={require("../../../assets/images/Apple.png")} className="object-contain h-[25px] w-[25px]"/>
                            <Text style={{fontFamily: "os-sb"}} className="text-black text-[17px] ml-2">Sign in with Apple</Text>
                    </TouchableOpacity>
                    <View className="mt-2 flex-row items-center justify-center">
                        <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("Signup")
                        }}>
                            <Text style={{fontFamily:"os-b"}} className="text-[#186F65]">Sign up</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default SigninScreen;