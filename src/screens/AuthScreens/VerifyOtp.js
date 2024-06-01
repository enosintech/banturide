import { View, Text, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, SafeAreaView, PixelRatio } from 'react-native';
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';

import LoadingBlur from '../../components/atoms/LoadingBlur';
import { safeViewAndroid } from './WelcomeScreen';

const VerifyOtp = (props) => {

    const navigation = useNavigation();

    const height = Dimensions.get('window').height;
    const width = Dimensions.get("window").width;

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const [error, setError ] = useState("")
    const [errorVisible, setErrorVisible] = useState(false);
    const [ loading, setLoading ] = useState(false)

    const [ userData, setUserData ] = useState({});
    const [ otp, setOtp ] = useState({
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
        value6: "",
    });

    const firstTextInputRef = useRef(null)
    const secondTextInputRef = useRef(null);
    const thirdTextInputRef = useRef(null);
    const fourthTextInputRef = useRef(null);
    const fifthTextInputRef = useRef(null);
    const sixthTextInputRef = useRef(null);

    const getUserData = async () => {
        await SecureStore.getItemAsync("user").then((data) => {
            const responseData = JSON.parse(data);
            setUserData(responseData);
        }).catch((err) => {
            console.log(err)
        });
    }

    useEffect(() => {
        getUserData();
    }, [])

    const handleEmailVerify = async () => {
        Keyboard.dismiss()
        setLoading(true)
        
        if(otp.length <= 0 || otp.length < 6){
            setLoading(false)
            setError("Please enter 6-digit OTP");
            setErrorVisible(true);
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000)
            return;
        }

        const joinedOtp = Object.values(otp).join("");

        const otpData = {
            email: userData["user"]?.email,
            enteredOTP: joinedOtp,
        }

        await fetch("https://banturide.onrender.com/auth/verify-otp", {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(otpData)
        })
        .then(response => response.json())
        .then(async data => {
            if(data.success === false){
                console.log(data.message)
                setLoading(false)
                setError(data.message)
                setErrorVisible(true)
                setTimeout(() => {
                    setErrorVisible(false)
                }, 4000)
            } else {
                const newData = {
                    ...userData
                }

                newData["user"].otp = null;
                const sendData = newData;

                await SecureStore.setItemAsync("user", JSON.stringify(sendData)).then(() => {
                    setLoading(false)
                    navigation.reset({
                        index: 0,
                        routes: [{name: "Signin"}]
                    })
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
        keyboardVerticalOffset={-100}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <SafeAreaView style={[safeViewAndroid.AndroidSafeArea, {height: height}]} className={`w-full items-center justify-center relative`}>
                <LoadingBlur loading={loading} />
                <View className={`w-[95%] h-[70%] flex items-center`}>
                    <Text style={{fontSize: getFontSize(20)}} className={`font-extrabold tracking-tight`}>Verify Email Address</Text>
                    <Text style={{fontSize: getFontSize(14)}} className={`text-center px-10 mt-3 font-medium tracking-tight`}>We sent a 6-digit One Time Pin (OTP) to your email address. Please enter the OTP below and verify your email.</Text>
                    <View className={`w-[60%] h-[15%] ${props.theme === "dark" ? "" : "border-gray-500"} ${errorVisible ? "border-red-600" : ""} mt-10 border-[0.3px] rounded-[20px] flex flex-col items-center justify-center`}>
                        <Text style={{fontSize: getFontSize(14)}} className={`${errorVisible ? "text-red-600" : "text-gray-700"} font-thin tracking-tight`}>OTP must be 6 digits</Text>
                    </View>
                    <View className={`w-full h-[50%] rounded-[20px] ${props.theme === "dark" ? "" : "bg-white"} flex items-center justify-evenly mt-10`}>
                        <View className={`w-full h-[60%] flex flex-row items-center justify-evenly`}>
                            <TextInput ref={(ref) => (firstTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[43%] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value1: x})
                                }
                                if(x.length >= 1){
                                    secondTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (secondTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[43%] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value2: x})
                                }
                                if(x.length >= 1){
                                    thirdTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    firstTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (thirdTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[43%] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value3: x})
                                }
                                if(x.length >= 1){
                                    fourthTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    secondTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (fourthTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[43%] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value4: x})
                                }
                                if(x.length >= 1){
                                    fifthTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    thirdTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (fifthTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[43%] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value5: x})
                                }
                                if(x.length >= 1){
                                    sixthTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    fourthTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (sixthTextInputRef.current = ref)} blurOnSubmit={true} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[43%] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value6: x})
                                }
                                if(x.length <= 0){
                                    fifthTextInputRef?.current?.focus()
                                }
                            }} />
                        </View>
                        <View className={`w-full h-[40%] flex items-center justify-center`}>
                            <View className={`w-[95%] h-[80%] rounded-[20px] bg-white shadow flex items-center justify-center`}>
                                <TouchableOpacity style={{width: width * 0.77}} className={`bg-[#186f65] p-4 flex items-center rounded-[25px]`} onPress={handleEmailVerify}>
                                    <Text style={{fontSize: getFontSize(20)}} className={`text-white font-bold tracking-tight`}>Verify My Email</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default VerifyOtp;