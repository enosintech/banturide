import { View, Text, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';
import LoadingBlur from '../../components/atoms/LoadingBlur';

const VerifyOtp = (props) => {

    const navigation = useNavigation();

    const height = Dimensions.get('window').height;
    const width = Dimensions.get("window").width;

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
            <View style={{height: height}} className={`w-full items-center justify-center relative`}>
                <LoadingBlur loading={loading} />
                <View className={`w-[95%] h-[70%] flex items-center`}>
                    <Text style={{fontFamily: "os-xb"}} className={`text-xl`}>Verify Email Address</Text>
                    <Text style={{fontFamily: "os-mid"}} className={`text-center px-10 mt-3`}>We sent a 6-digit One Time Pin (OTP) to your email address. Please enter the OTP below and verify your email.</Text>
                    <View className={`w-full h-[30%] rounded-[20px] ${props.theme === "dark" ? "" : "bg-white"} flex flex-row items-center justify-evenly mt-10`}>
                        <TextInput maxLength={1} keyboardType='numeric' className={`w-[14%] h-[40%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                            if(!isNaN(x)){
                                setOtp({...otp, value1: x})
                            }
                        }}/>
                        <TextInput maxLength={1} keyboardType='numeric' className={`w-[14%] h-[40%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                            if(!isNaN(x)){
                                setOtp({...otp, value2: x})
                            }
                        }}/>
                        <TextInput maxLength={1} keyboardType='numeric' className={`w-[14%] h-[40%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                            if(!isNaN(x)){
                                setOtp({...otp, value3: x})
                            }
                        }}/>
                        <TextInput maxLength={1} keyboardType='numeric' className={`w-[14%] h-[40%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                            if(!isNaN(x)){
                                setOtp({...otp, value4: x})
                            }
                        }}/>
                        <TextInput maxLength={1} keyboardType='numeric' className={`w-[14%] h-[40%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                            if(!isNaN(x)){
                                setOtp({...otp, value5: x})
                            }
                        }}/>
                        <TextInput maxLength={1} keyboardType='numeric' className={`w-[14%] h-[40%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                            if(!isNaN(x)){
                                setOtp({...otp, value6: x})
                            }
                        }} />
                    </View>
                    <View className={`w-[60%] h-[15%] ${props.theme === "dark" ? "" : "border-gray-800"} ${errorVisible ? "border-red-600" : ""} mt-10 border-[0.5px] rounded-[20px] flex flex-col items-center justify-center`}>
                        <Text style={{fontFamily: "os-b"}} className={`${errorVisible ? "text-red-600" : ""} text-lg`}>Enter 6-digit OTP</Text>
                    </View>
                    <View className={`p-5 h-[20%] ${props.theme === "dark" ? "" : "bg-white"} mt-10 rounded-[20px] flex items-center justify-center`}>
                        <TouchableOpacity style={{width: width * 0.7}} className={`bg-[#186f65] p-4 flex items-center rounded-[20px]`} onPress={handleEmailVerify}>
                            <Text style={{fontFamily: "os-b"}} className={`text-white text-xl`}>Verify My Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default VerifyOtp;