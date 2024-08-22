import {Text, View, Dimensions, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import LoadingBlur from "../../components/atoms/LoadingBlur";

const { width } = Dimensions.get("window");

const ForgotPassword = (props) => {
    
    const [ email, setEmail ] = useState("");
    const [error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false)

    const navigation = useNavigation();

    const fontSize = width * 0.05;

    const handleGetRecovery = () => {
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

        navigation.navigate("Signin");
    }

    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : ""} w-full h-full flex flex-col items-center relative`}>
            <LoadingBlur loading={loading} theme={props.theme}/>
            <View className={`w-full h-[10%] flex flex-row items-center justify-center px-2`}>
                <Text style={{fontSize: fontSize * 1.1}} className={`font-extrabold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Forgot Password</Text>
            </View>
            <View className="w-full h-[10%] p-5 flex items-center justify-center">
                <Text style={{fontSize: fontSize * 0.7}} className={`font-regular tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Please Enter your Email Address Below. We will send you a link that you can use to change your password</Text>
            </View>
            <View className={`w-[90%] h-[30%] shadow ${props.theme === "dark" ? "bg-[#353d4a]" : "bg-white"} rounded-[40px] flex items-center justify-evenly`}>
                <TextInput 
                    style={{fontSize: fontSize * 0.75}}
                    className={`w-[85%] h-[25%] ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} rounded-full border-[0.25px] border-solid px-4 font-medium tracking-tight`}
                    placeholder="Your Email"
                    placeholderTextColor="rgb(156 163 175)"
                    onChangeText={(x) => setEmail(x)}
                />
                {error !== "" && 
                    <View>
                        <Text style={{fontSize: fontSize * 0.65}} className={`font-medium tracking-tight text-red-600`}>{error}</Text>
                    </View>
                }
                <TouchableOpacity onPress={handleGetRecovery} className={`w-[85%] h-[25%] bg-[#186f65] rounded-full flex items-center justify-center`}>
                    <Text style={{fontSize: fontSize * 0.85}} className="text-white font-bold tracking-tight">Get Recovery Link</Text>
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-10 w-full h-[10%] flex flex-row items-center justify-center">
                <Text style={{fontSize: fontSize * 0.75}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Here Accidentally? </Text>
                <TouchableOpacity onPress={() => {
                    navigation.goBack();
                }}><Text style={{fontSize: fontSize * 0.75}} className={`font-bold tracking-tight text-[#186f65]`}>Sign-In</Text></TouchableOpacity>
            </View>
        </View>
    )
}

export default ForgotPassword;