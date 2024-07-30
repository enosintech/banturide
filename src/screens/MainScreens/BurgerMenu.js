import { useNavigation } from "@react-navigation/native";
import {Text, View, TouchableOpacity, Dimensions, PixelRatio } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BurgerMenuItem from "../../components/atoms/BurgerMenuItem.js";
import ShortModalNavBar from "../../components/atoms/ShortModalNavBar.js";

import { setIsSignedIn, setToken } from "../../../slices/authSlice.js";

import LoadingBlur from "../../components/atoms/LoadingBlur.js";

const BurgerMenu = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    const [ loading, setLoading ] = useState(false);

    const height = Dimensions.get("window").height;

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const handleSignOut = async () => {
        setLoading(true)
        
        await fetch("http://localhost:8080/auth/passenger-signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then( async () => {
            setLoading(false)
            await SecureStore.deleteItemAsync("tokens").then(() => {
                console.log("Token deleted Successfully")
                dispatch(setToken(null))
                dispatch(setIsSignedIn(false))
            }).catch((error) => {
                console.log(error)
            })
        })
    }
    
    return(
        <View style={{height: height}} className="w-full flex-col justify-end relative">
            <LoadingBlur color={"transparent"} loading={loading} />
            <View className={`h-[40%] relative z-10 w-full ${props.theme === "light" ? "bg-white" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-2xl rounded-t-2xl`}>
                <View className={`w-full h-[5%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className={`h-[15%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center px-3`}>
                    <Text style={{fontSize: getFontSize(18)}} className={`font-medium tracking-tight ${props.theme === "light" ? "text-black" : props.theme === "dark" ? "text-white" : "text-black"}`}>Dark Mode: </Text>
                    <TouchableOpacity onPress={() => {
                        props.toggleDarkMode()
                    }}>
                        <FontAwesome name={`${props.theme === "dark" ? "toggle-on" : "toggle-off"}`} size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    </TouchableOpacity>
                </View>
                <BurgerMenuItem theme={props.theme} iconName="info" text="About" handlePress={() => {
                    navigation.navigate("About")
                }}/>
                <TouchableOpacity className={`h-[20%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={handleSignOut}>
                    <MaterialIcons name="logout" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`} />
                    <Text style={{fontSize: getFontSize(15)}} className={`font-bold tracking-tight ml-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign Out</Text>
                </TouchableOpacity>
                <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[20%]`}></View>
            </View>
        </View>
    )
}

export default BurgerMenu;