import {SafeAreaView, Image, Text, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Dimensions, PixelRatio } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LongTextInput from "../../components/atoms/LongTextInput";
import LongGreenBtn from "../../components/atoms/LongGreenBtn";
import BackButton from "../../components/atoms/BackButton";

import { selectUser, setUser } from "../../../slices/authSlice";
import { safeViewAndroid } from "./WelcomeScreen";

const SignupScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const [ visible, setVisible ] = useState(false);
    const [ error, setError ] = useState("");
    const [ errorVisible, setErrorVisible ] =  useState(false);

    const height = Dimensions.get('window').height;

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const handleSignUpPress = () => {
        if(Object.values(user).includes("")) {
            setError("All fields are required");
            setErrorVisible(true);
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000)
            return;
        } else {
            navigation.navigate("setpassword");
        }
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 justify-end flex-col"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-250}>
            <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
                <SafeAreaView style={[safeViewAndroid.AndroidSafeArea, {height: height}]} className={`${props.theme === "dark" ? "bg-[#222831]" : ""} w-full flex-col items-center justify-between`}>
                    <View className="w-full h-[10%]">
                        <View className="w-full pl-2 pt-2">
                            <BackButton theme={props.theme} value="Back" handlePress={() => {
                                navigation.navigate("Welcome")
                            }} />
                        </View> 
                    </View>
                    <View className="h-[90%] w-full flex items-center">
                        <View className="h-[15%]">
                            <Text style={{fontSize: getFontSize(30)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Sign up with your Email</Text>
                        </View>
                        <View className={`relative z-20 h-[40%] ${props.theme === "dark" ? "border-gray-900" : "bg-white"} rounded-2xl w-[90%] flex items-center justify-evenly`}>
                            <LongTextInput text={user?.firstName} theme={props.theme} placeholder="First Name" dismissGenderToggle={() => {
                                setVisible(false)
                            }} handleTextChange={(x) => {
                                dispatch(setUser({...user, firstName: x}))
                            }}/>
                            <LongTextInput text={user?.lastName} theme={props.theme} placeholder="Last Name" dismissGenderToggle={() => {
                                setVisible(false)
                            }} handleTextChange={(x) => {
                                dispatch(setUser({...user, lastName: x}))
                            }} />
                            <LongTextInput type={"emailAddress"} text={user?.email} theme={props.theme} placeholder="Email" dismissGenderToggle={() => {
                                setVisible(false)
                            }} handleTextChange={(x) => {
                                dispatch(setUser({...user, email: x}))
                            }} />
                            <View
                                className={`relative ${props.theme === "dark" ? "bg-gray-500 border-gray-900" : "bg-white border-gray-400"} h-[20%] w-[85%] border-[0.25px] border-solid rounded-xl p-2`}
                            >
                                <TouchableOpacity className={`w-full h-full flex flex-row items-center justify-between`} onPress={() => {
                                    Keyboard.dismiss()
                                    setVisible(!visible)
                                }}>
                                    <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" && user?.gender ? "text-white" : props.theme === "dark" && user?.gender === null ? "text-gray-400" : props.theme === "light" && user?.gender ? "text-black" : "text-gray-400"} font-bold tracking-tight`}>{user?.gender ? user.gender : "Gender"}</Text>
                                    <Ionicons name={`${visible ? "chevron-up" : "chevron-down" }`} size={23} color={`${props.theme === "dark" ? "white" : "black"}`} />
                                </TouchableOpacity>
                                <View className={`absolute ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} ${visible ? "flex" : "hidden"} justify-center shadow-2xl rounded-2xl w-full h-[110px] top-14 z-30 left-2`}>
                                    <TouchableOpacity className={` w-full h-1/2 rounded-t-2xl flex justify-center px-3 border-b-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
                                        dispatch(setUser({...user, gender: "Male"}))
                                        setVisible(!visible);
                                    }}>
                                        <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-semibold tracking-tight`}>Male</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className={`w-full h-1/2 rounded-b-2xl flex justify-center px-3 border-t-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
                                        dispatch(setUser({...user, gender: "Female"}))
                                        setVisible(!visible);
                                    }}>
                                        <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px] font-semibold tracking-tight`}>Female</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View className="w-[85%] mt-3 flex-row items-center flex-wrap">
                            <Ionicons name="checkmark-circle-outline" size={20} color="#186F65"/>
                            <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}> By signing up, you agree to the </Text> 
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("TnCs", {toggle: "tncs"});
                            }}>
                                <Text style={{fontSize: getFontSize(14)}} className="text-[#186F65] font-bold tracking-tight">Terms of Service</Text>
                            </TouchableOpacity>
                            <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}> and </Text> 
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("TnCs", {toggle: "pp"});
                            }}>
                                <Text style={{fontSize: getFontSize(14)}} className="text-[#186F65] font-bold tracking-tight">Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="w-[90%] py-3 h-[30%] bg-white shadow rounded-[20px] flex items-center justify-evenly mt-5">
                            {errorVisible &&
                                <Text style={{fontSize: getFontSize(14)}} className={`text-red-600 font-bold tracking-tight mb-2`}>{error}</Text>
                            }
                            <LongGreenBtn value="Sign up" handlePress={handleSignUpPress}/>

                            <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-gray-400"} font-semibold tracking-tight`}>- or -</Text>
                            <TouchableOpacity disabled={true} className="bg-gray-200 opacity-40 shadow-2xl w-[85%] h-[25%] rounded-[25px] flex-row justify-center items-center">
                                <Image source={require("../../../assets/images/Google.png")} className="object-contain h-[22px] w-[22px]"/>
                                <Text style={{fontSize: getFontSize(15)}} className="text-black font-semibold tracking-tight ml-2">Sign up with Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={true} className="bg-white opacity-40 shadow-2xl w-[85%] h-[25%] rounded-[25px] flex-row justify-center items-center">
                                <Image source={require("../../../assets/images/Apple.png")} className="object-contain h-[22px] w-[22px]"/>
                                <Text style={{fontSize: getFontSize(15)}} className="text-black font-semibold tracking-tight ml-2">Sign up with Apple</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center mt-4">
                            <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Signin")
                            }}>
                                <Text style={{fontSize: getFontSize(14)}} className=" ml-1 text-[#186F65] font-bold tracking-tight">Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SignupScreen;