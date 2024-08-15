import { Text, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Dimensions, PixelRatio } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import LongTextInput from "../../components/atoms/LongTextInput";
import BackButton from "../../components/atoms/BackButton";

import { selectUser, setUser } from "../../../slices/authSlice";

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
                <SafeAreaView style={[{height: height}]} className={`${props.theme === "dark" ? "bg-[#222831]" : ""} w-full flex-col items-center justify-between`}>
                    <View className="w-full h-[10%]">
                        <View className="w-full pl-5 pt-2">
                            <BackButton theme={props.theme} value="Back" handlePress={() => {
                                navigation.navigate("Welcome")
                            }} />
                        </View> 
                    </View>
                    <View className="h-[90%] w-full flex items-center">
                        <View className="h-[15%]">
                            <Text style={{fontSize: getFontSize(30)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Registration</Text>
                        </View>
                        <View className={`relative z-20 h-[40%] ${props.theme === "dark" ? "border-gray-900" : "bg-white"} rounded-[40px] w-[90%] flex items-center justify-evenly`}>
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
                                className={`relative ${props.theme === "dark" ? "bg-gray-500 border-gray-900" : "bg-white border-gray-400"} h-[20%] w-[90%] border-[0.25px] border-solid rounded-[25px] p-2 px-4`}
                            >
                                <TouchableOpacity className={`w-full h-full flex flex-row items-center justify-between`} onPress={() => {
                                    Keyboard.dismiss()
                                    setVisible(!visible)
                                }}>
                                    <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" && user?.gender ? "text-white" : props.theme === "dark" && user?.gender === null ? "text-gray-400" : props.theme === "light" && user?.gender ? "text-black" : "text-gray-400"} font-bold tracking-tight`}>{user?.gender ? user.gender : "Gender"}</Text>
                                    <Ionicons name={`${visible ? "chevron-up" : "chevron-down" }`} size={23} color={`${props.theme === "dark" ? "white" : "black"}`} />
                                </TouchableOpacity>
                                <View className={`absolute ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} ${visible ? "flex" : "hidden"} justify-center shadow-2xl rounded-[30px] w-full h-[110px] top-14 z-30 left-2`}>
                                    <TouchableOpacity className={` w-full h-1/2 rounded-t-[40px] flex justify-center px-3 border-b-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
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
                        <View className="w-[90%] py-3 h-[30%] bg-white shadow rounded-[40px] flex items-center justify-evenly mt-5">
                            {errorVisible &&
                                <Text style={{fontSize: getFontSize(14)}} className={`text-red-600 font-bold tracking-tight mb-2`}>{error}</Text>
                            }
                            <TouchableOpacity className="bg-[#186F65] shadow-sm w-[85%] h-[40%] rounded-[50px] flex justify-center items-center" onPress={handleSignUpPress}>
                                <Text style={{fontSize: getFontSize(20)}} className="text-white font-bold tracking-tight">Sign up</Text>
                            </TouchableOpacity>
                            <View className="flex-row items-center mt-4">
                                <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>Already have an account?</Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Signin")
                                }}>
                                    <Text style={{fontSize: getFontSize(14)}} className=" ml-1 text-[#186F65] font-bold tracking-tight">Sign in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SignupScreen;