import { Text, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import LongTextInput from "../../components/atoms/LongTextInput";
import BackButton from "../../components/atoms/BackButton";

import { selectUser, setUser } from "../../../slices/authSlice";

const { width } = Dimensions.get("window");

const SignupScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const [ visible, setVisible ] = useState(false);
    const [ error, setError ] = useState("");
    const [ errorVisible, setErrorVisible ] =  useState(false);

    const height = Dimensions.get('window').height;

    const fontSize = width * 0.05;

    const handleSignUpPress = () => {
        if(Object.values(user).includes("")) {
            setErrorVisible(true);
            setError("All fields are required");
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000)
            return;
        } 
        
        const emailRegex = /\S+@\S+\.\S+/;

        if (!emailRegex.test(user.email)) {
            setErrorVisible(true);
            setError("Please enter a valid email address");
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000);
            return;
        }
        
        navigation.navigate("setpassword");
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 justify-end flex-col"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-250}>
            <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
                <SafeAreaView style={[{height: height}]} className={`${props.theme === "dark" ? "bg-dark-primary" : ""} w-full flex-col items-center justify-between relative`}>

                    <View className="w-full h-[10%]">
                        <View className="w-full pl-5 pt-2">
                            <BackButton theme={props.theme} value="Back" handlePress={() => {
                                navigation.navigate("Welcome")
                            }} />
                        </View> 
                    </View>
                    <View className="h-[90%] w-full flex items-center">
                        <View className="h-[15%]">
                            <Text style={{fontSize: fontSize * 1.5}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Registration</Text>
                        </View>
                        <View className={`relative z-20 h-[40%] ${props.theme === "dark" ? "border-gray-900 w-full" : "bg-white w-[90%]"} rounded-[40px] shadow-sm flex items-center justify-evenly`}>
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
                                className={`relative ${props.theme === "dark" ? "bg-gray-500 border-gray-900" : "bg-white border-gray-400"} w-[90%] h-[20%] border-[0.25px] border-solid rounded-[25px] p-2 px-4`}
                            >
                                <TouchableOpacity className={`w-full h-full flex flex-row items-center justify-between`} onPress={() => {
                                    Keyboard.dismiss()
                                    setVisible(!visible)
                                }}>
                                    <Text style={{fontSize: fontSize * 0.8}} className={`${props.theme === "dark" && user?.gender ? "text-white" : props.theme === "dark" && user?.gender === null ? "text-gray-400" : props.theme === "light" && user?.gender ? "text-black" : "text-gray-400"} font-bold tracking-tight`}>{user?.gender ? user.gender : "Gender"}</Text>
                                    <Ionicons name={`${visible ? "chevron-up" : "chevron-down" }`} size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`} />
                                </TouchableOpacity>
                                <View className={`absolute ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} ${visible ? "flex" : "hidden"} justify-center shadow-2xl rounded-[30px] w-full h-[110px] top-14 z-30 left-2`}>
                                    <TouchableOpacity className={` w-full h-1/2 rounded-t-[40px] flex justify-center px-3 border-b-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
                                        dispatch(setUser({...user, gender: "Male"}))
                                        setVisible(!visible);
                                    }}>
                                        <Text style={{fontSize: fontSize * 0.8}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-semibold tracking-tight`}>Male</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className={`w-full h-1/2 rounded-b-2xl flex justify-center px-3 border-t-[0.25px] ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`} onPress={() => {
                                        dispatch(setUser({...user, gender: "Female"}))
                                        setVisible(!visible);
                                    }}>
                                        <Text style={{fontSize: fontSize * 0.8}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px] font-semibold tracking-tight`}>Female</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View className="w-[85%] mt-3 flex-row items-center flex-wrap">
                            <Ionicons name="checkmark-circle-outline" size={fontSize} color="#186F65"/>
                            <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}> By signing up, you agree to the </Text> 
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("TnCs", {toggle: "tncs"});
                            }}>
                                <Text style={{fontSize: fontSize * 0.7}} className="text-[#186F65] font-bold tracking-tight">Terms of Service</Text>
                            </TouchableOpacity>
                            <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}> and </Text> 
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("TnCs", {toggle: "pp"});
                            }}>
                                <Text style={{fontSize: fontSize * 0.7}} className="text-[#186F65] font-bold tracking-tight">Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                        <View className={`w-[90%] py-3 h-[30%] ${props.theme === "dark" ? "bg-[#353d4a]" : "bg-white"} shadow-sm rounded-[40px] flex items-center justify-evenly mt-5`}>
                            {errorVisible &&
                                <Text style={{fontSize: fontSize * 0.7}} className={`text-red-600 font-bold tracking-tight mb-2`}>{error}</Text>
                            }
                            <TouchableOpacity className="bg-[#186F65] shadow-sm w-[85%] h-[40%] rounded-[50px] flex justify-center items-center" onPress={handleSignUpPress}>
                                <Text style={{fontSize: fontSize * 1.2}} className="text-white font-extrabold tracking-tight">Sign up</Text>
                            </TouchableOpacity>
                            <View className="flex-row items-center mt-4">
                                <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Already have an account?</Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Signin")
                                }}>
                                    <Text style={{fontSize: fontSize * 0.7}} className=" ml-1 text-[#186F65] font-extrabold tracking-tight">Sign in</Text>
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