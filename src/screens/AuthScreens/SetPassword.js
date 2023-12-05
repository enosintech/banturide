import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../components/lib/Config";

import BackButton from '../../components/atoms/BackButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmail, selectFirstName, selectGender, selectLastName, selectPassword, selectPasswordConfirm, setPassword, setPasswordConfirm } from '../../../slices/authSlice';

const SetPassword = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [ visible_1, setVisible_1 ] = useState(true);
    const [ visible_2, setVisible_2 ] = useState(true);
    const [errorVisible, setErrorVisible ] = useState(false);
    const [ error, setError ] = useState("Error, hehehehe");

    const first = useSelector(selectFirstName);
    const last = useSelector(selectLastName);
    const email = useSelector(selectEmail);
    const gender = useSelector(selectGender);
    const password = useSelector(selectPassword);
    const confirmPassword = useSelector(selectPasswordConfirm);

    const handleSignUp = async () => {
        if( email === "" || password === "") {
            setErrorVisible(true);
            setError("Email and Password are required")
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setErrorVisible(true);
            setError(error.message);
        }
    }
    
  return (
    <SafeAreaView className={`flex-1 ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"}`}>
        <View className={`w-full h-[8%] flex justify-center px-1`}>
            <BackButton theme={props.theme} value="Back" handlePress={() => {
                navigation.goBack();
            }}/>
        </View>
        <View className={`w-full h-[30%] flex items-center justify-center`}>
            <View className={`w-[80%] h-[70%] flex items-center justify-center`}>
                <Text style={{fontFamily:  "os-xb"}} className={`text-2xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>Create Password</Text>
                <Text style={{fontFamily: "os-sb"}} className={`text-gray-500 mt-2`}>Please create a strong password</Text>
                <View className={`${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}  mt-3 flex items-center border-[0.25px] p-4 rounded-2xl`}>
                    <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>Minimum 8 Characters</Text>
                    <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>Minimum 1 Symbol</Text>
                    <Text className={`font-thin ${props.theme === "dark" ? "text-white" : "text-black"}`}>Minimum 1 Number</Text>
                </View>
            </View>
        </View>
        <View className={`w-[90%] mx-auto h-[25%] border-[0.25px] rounded-2xl ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex items-center justify-center`}>
            <View className={`h-[35%] ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-xl flex-row items-center p-2`}>
                <TextInput
                    className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"}`}
                    placeholder="Enter Password"
                    style={{fontFamily: "os-sb"}}
                    placeholderTextColor="rgb(156 163 175)"
                    secureTextEntry={visible_1}
                    defaultValue={password}
                    onChangeText={x => dispatch(setPassword(x))}
                />
                <TouchableOpacity onPress={() => {
                    setVisible_1(!visible_1);
                }}>
                    <MaterialIcons name={`${visible_1 === true ? "visibility-off": "visibility"}`} size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </TouchableOpacity>
            </View>
            <View className={`h-[35%] mt-4 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] text-[15px] border-solid rounded-xl flex-row items-center p-2`}>
                <TextInput
                    className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"}`}
                    placeholder="Confirm Password"
                    style={{fontFamily: "os-sb"}}
                    placeholderTextColor="rgb(156 163 175)"
                    secureTextEntry={visible_2}
                    defaultValue={confirmPassword}
                    onChangeText={x => dispatch(setPasswordConfirm(x))}
                />
                <TouchableOpacity onPress={() => {
                    setVisible_2(!visible_2)
                }}>
                    <MaterialIcons name={`${visible_2 === true ? "visibility-off": "visibility"}`} size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </TouchableOpacity>
            </View>
        </View>
        <View className={`w-full h-[20%] mt-5 flex items-center justify-center`}>
            <Text style={{fontFamily: "os-sb"}} className={`w-[85%] h-[20%] ${errorVisible ? "block" : "hidden"} text-red-700 text-center text-[16px] overflow-hidden`}>{error}</Text>
            <TouchableOpacity className="bg-[#186F65] shadow-2xl w-[85%] h-[40%] rounded-2xl flex justify-center items-center" onPress={handleSignUp}>
                <Text style={{fontFamily: "os-b"}} className="text-[17px] text-white">Complete Sign Up</Text>
            </TouchableOpacity>
            <View className="w-[85%] mt-2 flex-row items-center flex-wrap">
                <Ionicons name="checkmark-circle-outline" size={20} color="#186F65"/>
                <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}> By completing, you agree to the </Text> 
                <TouchableOpacity onPress={() => {
                    navigation.navigate("TnCs");
                }}>
                    <Text style={{fontFamily: "os-b"}} className="text-[#186F65]">Terms of Service</Text>
                </TouchableOpacity>
                <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}> and </Text> 
                <TouchableOpacity onPress={() => {
                    navigation.navigate("TnCs");
                }}>
                    <Text style={{fontFamily:"os-b"}} className="text-[#186F65]">Privacy Policy</Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default SetPassword;