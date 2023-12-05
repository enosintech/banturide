import {SafeAreaView, Image, Text, TouchableOpacity, View, TextInput} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LongTextInput from "../../components/atoms/LongTextInput";
import LongGreenBtn from "../../components/atoms/LongGreenBtn";
import BackButton from "../../components/atoms/BackButton";

import { selectEmail, selectFirstName, selectGender, selectLastName, setGender, setFirstName, setLastName, setEmail } from "../../../slices/authSlice";

const SignupScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const firstName = useSelector(selectFirstName);
    const lastName = useSelector(selectLastName);
    const email = useSelector(selectEmail);
    const gender = useSelector(selectGender);

    const [ visible, setVisible ] = useState(false);
    
    return (
        <SafeAreaView className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} h-full w-full flex-col items-center justify-between`}>
            <View className="w-full h-[10%]">
                <View className="w-full pl-2 pt-2">
                    <BackButton theme={props.theme} value="Back" handlePress={() => {
                        navigation.goBack()
                    }}/>
                </View> 
            </View>
            <View className="h-[90%] w-full flex items-center">
                <View className="h-[15%]">
                    <Text style={{fontFamily: "os-mid"}} className={`text-[30px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign up with your Email</Text>
                </View>
                <View className={`relative z-20 h-[40%] border-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-2xl w-[90%] flex items-center justify-evenly`}>
                    <LongTextInput theme={props.theme} text={firstName} placeholder="First Name" handleTextChange={(x) => {
                        dispatch(setFirstName(x))
                    }}/>
                    <LongTextInput theme={props.theme} text={lastName} placeholder="Last Name" handleTextChange={(x) => {
                        dispatch(setLastName(x))
                    }} />
                    <LongTextInput theme={props.theme} text={email} placeholder="Email" handleTextChange={(x) => {
                        dispatch(setEmail(x))
                    }} />
                    <View
                        className={`relative ${props.theme === "dark" ? "bg-gray-500 border-gray-900" : "bg-white border-gray-400"} h-[20%] w-[85%] border-[0.25px] border-solid rounded-xl p-2`}
                    >
                        <TouchableOpacity className={`w-full h-full flex flex-row items-center justify-between`} onPress={() => {
                            setVisible(!visible)
                        }}>
                            <Text style={{fontFamily: "os-sb"}} className={`text-[15px] ${props.theme === "dark" && gender ? "text-white" : props.theme === "dark" && gender === null ? "text-gray-400" : props.theme === "light" && gender ? "text-black" : "text-gray-400"}`}>{gender ? gender : "Gender"}</Text>
                            <Ionicons name={`${visible ? "chevron-up" : "chevron-down" }`} size={23} color={`${props.theme === "dark" ? "white" : "black"}`} />
                        </TouchableOpacity>
                        <View className={`absolute ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} ${visible ? "flex" : "hidden"} justify-center shadow-2xl rounded-2xl w-full h-[110px] top-14 z-30 left-2`}>
                            <TouchableOpacity className={` w-full h-1/2 rounded-t-2xl flex justify-center px-3 border-b-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
                                dispatch(setGender("Male"))
                                setVisible(!visible);
                            }}>
                                <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px] tracking-wider`}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className={`w-full h-1/2 rounded-b-2xl flex justify-center px-3 border-t-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
                                dispatch(setGender("Female"))
                                setVisible(!visible);
                            }}>
                                <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px] tracking-wider`}>Female</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View className="w-[85%] mt-3 flex-row items-center flex-wrap">
                    <Ionicons name="checkmark-circle-outline" size={20} color="#186F65"/>
                    <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}> By signing up, you agree to the </Text> 
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("TnCs");
                    }}>
                        <Text style={{fontFamily: "os-b"}} className="text-[#186F65]">Terms of Service</Text>
                    </TouchableOpacity>
                    <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}> and </Text> 
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("TnCs");
                    }}>
                        <Text style={{fontFamily:"os-b"}} className="text-[#186F65]">Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
                <View className="w-full h-[30%] flex items-center justify-evenly mt-5">
                    <LongGreenBtn value="Sign up" handlePress={() => {
                        navigation.navigate("setpassword")
                    }}/>
                    <Text style={{fontFamily: "os-sb"}} className={`${props.theme === "dark" ? "text-white" : "text-gray-400"} text-[15px]`}>- or -</Text>
                    <TouchableOpacity className="bg-gray-200 shadow-2xl w-[85%] h-[25%] rounded-2xl flex-row justify-center items-center">
                        <Image source={require("../../../assets/images/Google.png")} className="object-contain h-[25px] w-[25px]"/>
                        <Text style={{fontFamily: "os-sb"}} className="text-black text-[15px] ml-2">Sign up with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-white shadow-2xl w-[85%] h-[25%] rounded-2xl flex-row justify-center items-center">
                        <Image source={require("../../../assets/images/Apple.png")} className="object-contain h-[25px] w-[25px]"/>
                        <Text style={{fontFamily: "os-sb"}} className="text-black text-[15px] ml-2">Sign up with Apple</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                    <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Already haven an account?</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Signin")
                    }}>
                        <Text style={{fontFamily: "os-b"}} className=" ml-1 text-[#186F65]">Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignupScreen;