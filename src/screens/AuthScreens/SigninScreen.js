import {SafeAreaView, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, PixelRatio} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";

import { safeViewAndroid } from "./WelcomeScreen";
import BackButton from "../../components/atoms/BackButton";
import LoadingBlur from "../../components/atoms/LoadingBlur";
import { selectIsSignedIn, selectUserInfo, setIsSignedIn } from "../../../slices/authSlice";

const SigninScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const [visible, setVisible] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [errorVisible, setErrorVisible ] = useState(false);
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const height = Dimensions.get("window").height;

    const isSignedIn = useSelector(selectIsSignedIn);

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

        await fetch("https://banturide-api.onrender.com/auth/signin", options)
        .then(response => response.json())
        .then( async data => {
            if(data.message === "Logged in successfully"){
                await SecureStore.setItemAsync("tokens", JSON.stringify(data.userCredential._tokenResponse)).then(() => {
                    dispatch(setIsSignedIn(!isSignedIn))
                    setTimeout(() => {
                        setLoading(false)
                    }, 5000)
                })
            } else {
                setLoading(false)
                setErrorVisible(true)
                setError(data.message)
                console.log(data)
                setTimeout(() => {
                    setErrorVisible(false)
                }, 4000)
            }1

        })
    }

    return (
        <KeyboardAvoidingView 
            className="flex-1 justify-end flex-col"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-280}
            >
            <TouchableWithoutFeedback className={'w-full h-full'} onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={[safeViewAndroid.AndroidSafeArea, {height: height}]} className={`${props.theme === "light" ? "" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full flex-col relative items-center`}>
                    <LoadingBlur loading={loading}/>
                    <View className="w-full h-[10%]">
                        <View className="w-full pl-2 pt-2">
                            <BackButton theme={props.theme} value="Back" handlePress={() => {
                                navigation.navigate("Welcome");
                            }}/>
                        </View>
                    </View>
                    <View className="mt-5"></View>
                    <View className="h-[40%] w-full flex items-center">
                        <View className="h-[25%]">
                            <Text style={{fontSize: getFontSize(30)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Sign in with your Email</Text>
                        </View>
                        <View className={`h-[55%] ${props.theme === "dark" ? "border-gray-900" : "bg-white"} w-[90%] rounded-2xl flex items-center justify-center mt-5`}>
                            <TextInput
                                className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[30%] w-[90%] font-semibold tracking-tight border-[0.25px] p-2 border-solid rounded-xl`} 
                                placeholder="Email"
                                style={{ fontSize: getFontSize(15)}}
                                placeholderTextColor="rgb(156 163 175)"
                                onChangeText={(x) => setEmail(x)}
                            />
                            <View className={`h-[30%] mt-5 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] border-solid rounded-xl flex-row items-center p-2`}>
                                <TextInput
                                    className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"} font-semibold tracking-tight`}
                                    placeholder="Password"
                                    style={{fontSize: getFontSize(15)}}
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
                        <View className="w-full h-fit mt-2 flex flex-row items-center justify-end">
                            <TouchableOpacity className="text-nowrap max-w-[40%] w-fit pr-7" onPress={() => {
                                    navigation.navigate("Forgot")
                                }}>
                                    <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-right w-fit font-semibold tracking-tight`}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        {errorVisible && 
                            <View className="w-full h-fit mt-2 flex items-center justify-center">
                                <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-red-500 font-semibold tracking-tight`}>{error}</Text>
                            </View>
                        }
                    </View>
                    <View className="h-[38%] w-[90%] mt-4 rounded-[20px] py-5 flex items-center justify-center bg-white">
                        <TouchableOpacity className="bg-[#186F65] shadow-lg w-[85%] h-[20%] rounded-[25px] flex justify-center items-center" onPress={handleEmailPasswordSignIn}>
                            <Text style={{fontSize: getFontSize(17)}} className="text-white font-bold tracking-tight">Sign in</Text>
                        </TouchableOpacity>
                        <Text className={`${props.theme === "dark" ? "text-white" : "text-gray-400"} mt-2 font-semibold tracking-tight`} style={{fontSize: getFontSize(15)}}>- or -</Text>
                        <View className="mt-2"></View>
                        <TouchableOpacity disabled={true} className="bg-gray-200 opacity-40 shadow-2xl w-[85%] h-[20%] rounded-[25px] flex-row justify-center items-center">
                            <Image source={require("../../../assets/images/Google.png")} className="object-contain h-[22px] w-[22px]"/>
                            <Text style={{fontSize: getFontSize(15)}} className="text-black ml-2 font-semibold tracking-tight">Sign in with Google</Text>
                        </TouchableOpacity>
                        <View className="mt-2"></View>
                        <TouchableOpacity disabled={true} className="bg-white opacity-40 shadow-2xl w-[85%] h-[20%] rounded-[25px] flex-row justify-center items-center">
                                <Image source={require("../../../assets/images/Apple.png")} className="object-contain h-[22px] w-[22px]"/>
                                <Text style={{fontSize: getFontSize(15)}} className="text-black ml-2 font-semibold tracking-tight">Sign in with Apple</Text>
                        </TouchableOpacity>
                        <View className="mt-3 flex-row items-center justify-center">
                            <Text style={{fontSize: getFontSize(13)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Signup")
                            }}>
                                <Text style={{fontSize: getFontSize(13)}} className="text-[#186F65] font-bold tracking-tight">Sign up</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SigninScreen;