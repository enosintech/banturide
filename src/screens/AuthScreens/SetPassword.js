import { View, Text, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { selectUser, setForgotPasswordTriggered } from '../../../slices/authSlice';

import BackButton from '../../components/atoms/BackButton';
import LoadingBlur from '../../components/atoms/LoadingBlur';

const { width } = Dimensions.get("window");

const SetPassword = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

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

    const fontSize = width * 0.05;

    const userForm = {
        firstname: user?.firstName,
        lastname: user?.lastName,
        gender: user?.gender,
        email: user?.email,
        password: password,
    }

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

        await fetch('https://banturide-api.onrender.com/auth/passenger-signup', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(userForm)
        })
        .then(response => response.json())
        .then(async data => {

            if(data.success === false) {
                throw new Error(data.message || data.error)
            } else {
                setLoading(false)
                navigation.reset({
                    index: 0,
                    routes: [{ 
                        name: "Signin",
                        params: { 
                            resetMessage: "Check your email for verification link" 
                        }
                    }]
                })
                dispatch(setForgotPasswordTriggered(true))
                setTimeout(() => {
                    dispatch(setForgotPasswordTriggered(false))
                }, 5000)
            }
           
        })
        .catch((error) => {
            setLoading(false)
            setErrorVisible(true)
            setServerError(error.error || error.message || "There was a problem signing up")
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000)
        })
    }
    
  return (
    <KeyboardAvoidingView
        className="flex-1 justify-end flex-col"
        behavior={Platform.OS === "ios" ? "padding" : "height" }
        keyboardVerticalOffset={-180}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <SafeAreaView style={[{height: height}]} className={`w-full ${props.theme === "dark" ? "bg-dark-primary" : ""} relative flex flex-col items-center`}>
                <LoadingBlur loading={loading} theme={props.theme}/>
                <View className={`w-full h-[8%] flex justify-center px-6`}>
                    <BackButton theme={props.theme} value="Back" handlePress={() => {
                        navigation.goBack();
                    }}/>
                </View>
                <View className={`w-full h-[30%] flex items-center justify-center`}>
                    <View className={`w-[80%] h-[70%] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>Create Password</Text>
                        <Text style={{fontSize: fontSize * 0.7}} className={`text-gray-500 mt-2 font-semibold tracking-tighter`}>Please create a strong password</Text>
                        <View className={`${props.theme === "dark" ? "border-gray-900 border-[0.25px]" : "border-gray-400 border-[0.25px]"} ${error ? "border-red-600 border-2" : ""}  mt-3 flex items-center p-4 px-5 rounded-[25px]`}>
                            <Text style={{fontSize: fontSize * 0.7}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Confirm Password must match</Text>
                            <Text style={{fontSize: fontSize * 0.7}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Minimum 8 Characters</Text>
                            <Text style={{fontSize: fontSize * 0.7}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Minimum 1 Symbol</Text>
                            <Text style={{fontSize: fontSize * 0.7}} className={`font-extralight tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"} ${error ? "text-red-600" : ""}`}>Minimum 1 Number</Text>
                        </View>
                    </View>
                </View>
                <View className={`shadow-sm mx-auto h-[25%] rounded-[40px] ${props.theme === "dark" ? "border-gray-900 w-[90%] bg-dark-secondary"  : "bg-white w-[90%]"} flex items-center justify-center`}>
                    <View className={`h-[35%] ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-[30px] flex-row items-center p-2 px-4`}>
                        <TextInput
                            className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"} font-semibold tracking-tight`}
                            placeholder="Enter Password"
                            style={{fontSize: fontSize * 0.7}}
                            placeholderTextColor="rgb(156 163 175)"
                            secureTextEntry={visible_1}
                            defaultValue={password}
                            onChangeText={x => setPassword(x)}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            accessibilityLabel="Password Input"
                            accessibilityHint="Enter your password"
                        />
                        <TouchableOpacity onPress={() => {
                            setVisible_1(!visible_1);
                        }}>
                            <MaterialIcons name={`${visible_1 === true ? "visibility-off": "visibility"}`} size={fontSize * 1.2} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <View className={`h-[35%] mt-4 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-[30px] flex-row items-center p-2 px-4`}>
                        <TextInput
                            className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"} font-semibold tracking-tight`}
                            placeholder="Confirm Password"
                            style={{fontSize: fontSize * 0.7}}
                            placeholderTextColor="rgb(156 163 175)"
                            secureTextEntry={visible_2}
                            defaultValue={confirmPassword}
                            onChangeText={x => setConfirmPassword(x)}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            accessibilityLabel="Confirm Password Input"
                            accessibilityHint="Enter your password again"
                        />
                        <TouchableOpacity onPress={() => {
                            setVisible_2(!visible_2)
                        }}>
                            <MaterialIcons name={`${visible_2 === true ? "visibility-off": "visibility"}`} size={fontSize * 1.2} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={`w-[90%] ${errorVisible ? "h-[27%]" : "h-[25%]"} ${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"} rounded-[40px] shadow-sm mt-5 flex items-center justify-center`}>
                    <Text style={{fontSize: fontSize * 0.7}} className={`w-[85%] h-[20%] ${errorVisible ? "block" : "hidden"} text-red-700 text-center font-semibold tracking-tight text-wrap overflow-hidden`}>{serverError}</Text>
                    <TouchableOpacity className={`bg-[#186F65] mt-1 shadow w-[85%] ${errorVisible ? "h-[30%]" : "h-[40%]"} rounded-[50px] flex justify-center items-center`} onPress={handleSignUp}>
                        <Text style={{fontSize: fontSize}} className="text-white font-black tracking-tight">Complete Sign Up</Text>
                    </TouchableOpacity>
                    <View className="w-[85%] mt-4 pl-1 flex-row items-center justify-center flex-wrap">
                        <Ionicons name="checkmark-circle-outline" size={fontSize} color="#186F65"/>
                        <Text style={{fontSize: fontSize * 0.65}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}> By completing Sign Up, you agree to the </Text> 
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("TnCs", {toggle: "tncs"});
                        }}>
                            <Text style={{fontSize: fontSize * 0.65}} className="text-[#186F65] font-black tracking-tight">Terms of Service</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: fontSize * 0.65}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}> and </Text> 
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("TnCs", {toggle: "pp"});
                        }}>
                            <Text style={{fontSize: fontSize * 0.65}} className="text-[#186F65] font-black tracking-tight">Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default SetPassword;