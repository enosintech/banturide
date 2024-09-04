import {Text, View, Dimensions, TouchableOpacity, TextInput, Keyboard, Modal, Platform, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { setForgotPasswordTriggered } from "../../../slices/authSlice";

import ModalLoader from "../../components/atoms/ModalLoader";

const { width } = Dimensions.get("window");

const ForgotPassword = (props) => {
    
    const [ email, setEmail ] = useState("");
    const [error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false)

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const fontSize = width * 0.05;

    const height = Dimensions.get("window").height;

    const handleGetRecovery = async () => {
        Keyboard.dismiss();
        setLoading(true)

        if(email === ""){
            setLoading(false)
            setError("Email Address is required")
            setTimeout(() => {
                setError("")
            }, 4000)
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;

        if(!emailRegex.test(email)){
            setLoading(false)
            setError("Please enter a valid Email Address")
            setTimeout(() => {
                setError("")
            }, 4000)
            return;
        } 

        await fetch("https://banturide-api.onrender.com/auth/forgot-password", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(response => response.json())
        .then( async data => {
            if(data.success === false){
                throw new Error(data.message || data.error)
            } else {
                setLoading(false)
                navigation.navigate('Signin', { resetMessage: "Check provided email address"})
                dispatch(setForgotPasswordTriggered(true))
                setTimeout(() => {
                    dispatch(setForgotPasswordTriggered(false))
                }, 5000)
            }
        })
        .catch((error) => {
            setLoading(false)
            setError(error.message || error.error || "There wa a problem sending recovery link")
            setTimeout(() => {
                setError("")
            }, 4000)
        })
    }

    return(
        <KeyboardAvoidingView
            className="flex-1 justify-end flex-col"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-200}
        >
            <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
                <View style={[{ height: height}]} className={`${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} w-full flex flex-col items-center relative ${Platform.OS === "android" ? "pt-[10%]" : ""}`}>
                    
                    <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
                        if(loading === true){
                            return
                        } else {
                            setLoading(false)
                        }
                    }}>
                        <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
                            <ModalLoader theme={props.theme} />
                        </View>
                    </Modal>

                    <View className={`w-full h-[10%] flex flex-row items-center justify-center px-2`}>
                        <Text style={{fontSize: fontSize * 1.1}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Forgot Password</Text>
                    </View>
                    <View className="w-full h-[10%] p-5 flex items-center justify-center">
                        <Text style={{fontSize: fontSize * 0.7}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Please Enter your Email Address Below. We will send you a link that you can use to change your password</Text>
                    </View>
                    <View className={`w-[90%] h-[30%] shadow ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"} rounded-[40px] flex items-center justify-evenly`}>
                        <TextInput 
                            style={{fontSize: fontSize * 0.75}}
                            className={`w-[85%] h-[25%] ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} rounded-full border-[0.25px] border-solid px-4 font-medium tracking-tight`}
                            placeholder="Your Email"
                            placeholderTextColor="rgb(156 163 175)"
                            onChangeText={(x) => setEmail(x)}
                            keyboardType={"email-address"}
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {error !== "" && 
                            <View>
                                <Text style={{fontSize: fontSize * 0.65}} className={`font-medium tracking-tight text-red-600`}>{error}</Text>
                            </View>
                        }
                        <TouchableOpacity onPress={handleGetRecovery} className={`w-[85%] h-[25%] bg-[#186f65] rounded-full flex items-center justify-center`}>
                            <Text style={{fontSize: fontSize * 0.85}} className="text-white font-black tracking-tight">Get Recovery Email</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="absolute bottom-10 w-full h-[10%] flex flex-row items-center justify-center">
                        <Text style={{fontSize: fontSize * 0.75}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Here Accidentally? </Text>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack();
                        }}><Text style={{fontSize: fontSize * 0.75}} className={`font-black tracking-tight text-[#186f65]`}>Sign-In</Text></TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>   
        </KeyboardAvoidingView>
    )
}

export default ForgotPassword;