import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, PixelRatio } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import * as SecureStore from "expo-secure-store";

import { selectUser } from '../../../slices/authSlice';
import BackButton from '../../components/atoms/BackButton';
import LoadingBlur from '../../components/atoms/LoadingBlur';
import { safeViewAndroid } from './WelcomeScreen';

const SetPassword = (props) => {

    const navigation = useNavigation();

    const [ visible_1, setVisible_1 ] = useState(true);
    const [ visible_2, setVisible_2 ] = useState(true);

    const [errorVisible, setErrorVisible ] = useState(false);
    const [ serverError, setServerError] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ error, setError ] = useState(false);

    const user = useSelector(selectUser);

    const height = Dimensions.get('window').height;

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const userForm = {
        firstname: user.firstName,
        lastname: user.lastName,
        gender: user.gender,
        email: user.email,
        password: password,
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm)
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }      

    const handleSignUp = async () => {
        Keyboard.dismiss();
        setLoading(true)

        const isPasswordValid = validatePassword(password)

        if(password === "" || confirmPassword === ""){
            setLoading(false)
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 4000)
            return;
        }

        if (password !== confirmPassword) {
            setLoading(false)
            setError(true);
            setTimeout(() => {
                setError(false)
            }, 4000);
            return;
        }

        if(isPasswordValid === false){
            setLoading(false)
            setError(true);
            setTimeout(() => {
                setError(false)
            }, 4000);
            return;
        }

        await fetch('http://localhost:8080/auth/create-passenger', options)
        .then(response => response.json())
        .then(async data => {

            if(data.message === "User created successfully"){
                // await SecureStore.setItemAsync("idToken", JSON.stringify(data.userCredential._tokenResponse.idToken).then(() => {
                //     setLoading(false)
                //     navigation.reset({
                //         index: 0,
                //         routes: [{name: "Signin"}]
                //     })
                // })).catch((err) => {
                //     setLoading(false)
                //     console.log(err)
                // })
                // await SecureStore.setItemAsync("idToken", JSON.stringify(data.userCredential._tokenResponse.idToken)).then(() => {
                //     setLoading(false)
                //     navigation.reset({
                //         index: 0,
                //         routes: [{name: "Signin"}]
                //     })
                // }).catch((err) => {
                //     setLoading(false)
                //     console.log(err)
                // })

                setLoading(false)
                console.log(data)
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Signin"}]
                })
            } else {
                setLoading(false)
                setErrorVisible(true)
                setServerError(data.message);
                setTimeout(() => {
                    setErrorVisible(false)
                }, 4000)
            }
            // if(data.success === false){
            //     setLoading(false)
            //     setErrorVisible(true);
            //     setServerError(data.message);
            //     console.log(data)
            //     setTimeout(() => {
            //         setErrorVisible(false)
            //     }, 4000);
            // } else {
            //     await SecureStore.setItemAsync("user", JSON.stringify(data)).then(() => {
            //         setLoading(false)
            //         navigation.reset({
            //             index: 0,
            //             routes: [{name: "verifyotp"}]
            //         })
            //     }).catch((err) => {
            //         setLoading(false)
            //         console.log(err)
            //     })
            // }
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
  return (
    <KeyboardAvoidingView
        className="flex-1 justify-end flex-col"
        behavior={Platform.OS === "ios" ? "padding" : "height" }
        keyboardVerticalOffset={-180}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <SafeAreaView style={[safeViewAndroid.AndroidSafeArea, {height: height}]} className={`w-full ${props.theme === "dark" ? "bg-[#222831]" : ""} relative flex flex-col items-center`}>
                <LoadingBlur loading={loading}/>
                <View className={`w-full h-[8%] flex justify-center px-1`}>
                    <BackButton theme={props.theme} value="Back" handlePress={() => {
                        navigation.goBack();
                    }}/>
                </View>
                <View className={`w-full h-[30%] flex items-center justify-center`}>
                    <View className={`w-[80%] h-[70%] flex items-center justify-center`}>
                        <Text style={{fontSize: getFontSize(24)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>Create Password</Text>
                        <Text style={{fontSize: getFontSize(14)}} className={`text-gray-500 mt-2 font-semibold tracking-tight`}>Please create a strong password</Text>
                        <View className={`${props.theme === "dark" ? "border-gray-900 border-[0.25px]" : "border-gray-400 border-[0.25px]"} ${error ? "border-red-600 border-2" : ""}  mt-3 flex items-center p-4 rounded-2xl`}>
                            <Text style={{fontSize: getFontSize(14)}} className={`font-thin tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Minimum 8 Characters</Text>
                            <Text style={{fontSize: getFontSize(14)}} className={`font-thin tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Minimum 1 Symbol</Text>
                            <Text style={{fontSize: getFontSize(14)}} className={`font-thin tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Minimum 1 Number</Text>
                            <Text style={{fontSize: getFontSize(14)}} className={`font-thin tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Confirm Password must match</Text>
                        </View>
                    </View>
                </View>
                <View className={`w-[90%] mx-auto h-[25%] rounded-2xl ${props.theme === "dark" ? "border-gray-900" : "bg-white"} flex items-center justify-center`}>
                    <View className={`h-[35%] ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-xl flex-row items-center p-2`}>
                        <TextInput
                            className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"} font-semibold tracking-tight`}
                            placeholder="Enter Password"
                            style={{fontSize: getFontSize(14)}}
                            placeholderTextColor="rgb(156 163 175)"
                            secureTextEntry={visible_1}
                            defaultValue={password}
                            onChangeText={x => setPassword(x)}
                        />
                        <TouchableOpacity onPress={() => {
                            setVisible_1(!visible_1);
                        }}>
                            <MaterialIcons name={`${visible_1 === true ? "visibility-off": "visibility"}`} size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <View className={`h-[35%] mt-4 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-xl flex-row items-center p-2`}>
                        <TextInput
                            className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"} font-semibold tracking-tight`}
                            placeholder="Confirm Password"
                            style={{fontSize: getFontSize(14)}}
                            placeholderTextColor="rgb(156 163 175)"
                            secureTextEntry={visible_2}
                            defaultValue={confirmPassword}
                            onChangeText={x => setConfirmPassword(x)}
                        />
                        <TouchableOpacity onPress={() => {
                            setVisible_2(!visible_2)
                        }}>
                            <MaterialIcons name={`${visible_2 === true ? "visibility-off": "visibility"}`} size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={`w-[90%] ${errorVisible ? "h-[23%]" : "h-[20%]"} bg-white rounded-[20px] shadow mt-5 flex items-center justify-center`}>
                    <Text style={{fontSize: getFontSize(14)}} className={`w-[85%] h-[20%] ${errorVisible ? "block" : "hidden"} text-red-700 text-center font-semibold tracking-tight text-wrap overflow-hidden`}>{serverError}</Text>
                    <TouchableOpacity className={`bg-[#186F65] mt-1 shadow-2xl w-[85%] ${errorVisible ? "h-[30%]" : "h-[40%]"} rounded-[40px] flex justify-center items-center`} onPress={handleSignUp}>
                        <Text style={{fontSize: getFontSize(17)}} className="text-white font-bold tracking-tight">Complete Sign Up</Text>
                    </TouchableOpacity>
                    <View className="w-[85%] mt-4 pl-1 flex-row items-center flex-wrap">
                        <Ionicons name="checkmark-circle-outline" size={20} color="#186F65"/>
                        <Text style={{fontSize: getFontSize(14)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}> By completing Sign Up, you agree to the </Text> 
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
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default SetPassword;