import {SafeAreaView, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";

import BackButton from "../../components/atoms/BackButton";
import { selectIsSignedIn, setIsSignedIn } from "../../../slices/authSlice";
import LoadingBlur from "../../components/atoms/LoadingBlur";

const SigninScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isSignedIn = useSelector(selectIsSignedIn);

    const [visible, setVisible] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [errorVisible, setErrorVisible ] = useState(false);
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const height = Dimensions.get("window").height;

    const userForm = {
        email: email,
        password: password
    }

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm)
    };

    const handleEmailPasswordSignIn = async () => {
        Keyboard.dismiss()
        setLoading(true)

        if(email === "" || password === ""){
            setLoading(false)
            setErrorVisible(true);
            setError("No Email or Password Entered")
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000);
            return;
        }

        await fetch("https://banturide.onrender.com/auth/signin", options)
        .then(response => response.json())
        .then(async data => {
            if(data.success === false){
                setLoading(false)
                console.log(data.message)
                setError(data.message)
                if(data.message === "Please verify your OTP before logging in."){
                    navigation.navigate("loginVerifyOtp");
                } 
            } else {
                await SecureStore.setItemAsync("user", JSON.stringify(data)).then(() => {
                    dispatch(setIsSignedIn(!isSignedIn))
                    setTimeout(() => {
                        setLoading(false)
                    }, 5000)
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 justify-end flex-col"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-280}
            >
            <TouchableWithoutFeedback className={'w-full h-full'} onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={{height: height}} className={`${props.theme === "light" ? "" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full flex-col relative items-center`}>
                    <LoadingBlur loading={loading}/>
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
                        <View className={`h-[55%] ${props.theme === "dark" ? "border-gray-900" : "bg-white"} w-[90%] rounded-2xl flex items-center justify-center mt-5`}>
                            <TextInput
                                className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[30%] w-[90%] border-[0.25px] p-2 text-[15px] border-solid rounded-xl`} 
                                placeholder="Email"
                                style={{fontFamily: "os-sb"}}
                                placeholderTextColor="rgb(156 163 175)"
                                onChangeText={(x) => setEmail(x)}
                            />
                            <View className={`h-[30%] mt-5 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-xl flex-row items-center p-2`}>
                                <TextInput
                                    className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"}`}
                                    placeholder="Password"
                                    style={{fontFamily: "os-sb"}}
                                    placeholderTextColor="rgb(156 163 175)"
                                    secureTextEntry={!visible}
                                    onChangeText={(x) => setPassword(x)}
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
                    <View className="h-[38%] w-[90%] rounded-[20px] py-5 flex items-center justify-center bg-white">
                        <TouchableOpacity className="bg-[#186F65] shadow-lg w-[85%] h-[25%] rounded-2xl flex justify-center items-center" onPress={handleEmailPasswordSignIn}>
                            <Text style={{fontFamily: "os-b"}} className="text-[17px] text-white">Sign in</Text>
                        </TouchableOpacity>
                        <Text className={`${props.theme === "dark" ? "text-white" : "text-gray-400"} text-[15px] mt-2`} style={{fontFamily: "os-sb"}}>- or -</Text>
                        <View className="mt-2"></View>
                        <TouchableOpacity disabled={true} className="bg-gray-200 opacity-40 shadow-2xl w-[85%] h-[20%] rounded-2xl flex-row justify-center items-center">
                            <Image source={require("../../../assets/images/Google.png")} className="object-contain h-[25px] w-[25px]"/>
                            <Text style={{fontFamily: "os-sb"}} className="text-black text-[17px] ml-2">Sign in with Google</Text>
                        </TouchableOpacity>
                        <View className="mt-2"></View>
                        <TouchableOpacity disabled={true} className="bg-white opacity-40 shadow-2xl w-[85%] h-[20%] rounded-2xl flex-row justify-center items-center">
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
        </KeyboardAvoidingView>
    )
}

export default SigninScreen;