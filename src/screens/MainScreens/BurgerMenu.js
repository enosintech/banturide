import {Text, View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import BurgerMenuItem from "../../components/atoms/BurgerMenuItem.js";
import ShortModalNavBar from "../../components/atoms/ShortModalNavBar.js";
import ModalLoader from "../../components/atoms/ModalLoader.js";

import { setIsSignedIn, setToken, setTokenFetched, setUserInfo } from "../../../slices/authSlice.js";

import { removeItem } from "../../components/lib/asyncStorage.js";

const { width } = Dimensions.get("window");

const BurgerMenu = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [ loading, setLoading ] = useState(false);

    const height = Dimensions.get("window").height;

    const fontSize = width * 0.05;

    const handleSignOut = async () => {
        setLoading(true)
        
        await fetch("https://banturide-api.onrender.com/auth/signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then( async () => {
            setLoading(false)
            await SecureStore.deleteItemAsync("tokens").then(() => {
                console.log("Token deleted Successfully")
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(false))
                dispatch(setTokenFetched(false))
                removeItem("onboarded")
            }).catch((error) => {
                console.log(error)
            })
        })
    }
    
    return(
        <View style={{height: height}} className="w-full flex-col justify-end relative">

            <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
                if(loading === true){
                    return
                } else {
                    setLoading(false)
                }
             }}>
                <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
                    <ModalLoader theme={props.theme}/>
                </View>
             </Modal>

            <View className={`h-[40%] relative z-10 w-full ${props.theme === "light" ? "bg-white" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-2xl rounded-t-2xl`}>
                <View className={`w-full h-[5%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className={`h-[15%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center px-3`}>
                    <Text style={{fontSize: fontSize * 0.8}} className={`font-medium tracking-tight ${props.theme === "light" ? "text-black" : props.theme === "dark" ? "text-white" : "text-black"}`}>Dark Mode: </Text>
                    <TouchableOpacity onPress={() => {
                        props.toggleDarkMode()
                    }}>
                        <FontAwesome name={`${props.theme === "dark" ? "toggle-on" : "toggle-off"}`} size={fontSize * 1.5} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    </TouchableOpacity>
                </View>
                <BurgerMenuItem theme={props.theme} iconName="info" text="About" handlePress={() => {
                    navigation.navigate("About")
                }}/>
                <TouchableOpacity className={`h-[20%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={handleSignOut}>
                    <MaterialIcons name="logout" size={fontSize * 1.7} color={`${props.theme === "dark" ? "white" : "black"}`} />
                    <Text style={{fontSize: fontSize * 0.8}} className={`font-bold tracking-tight ml-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign Out</Text>
                </TouchableOpacity>
                <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[20%]`}></View>
            </View>
        </View>
    )
}

export default BurgerMenu;