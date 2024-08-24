import {Text, View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import BurgerMenuItem from "../../components/atoms/BurgerMenuItem.js";
import ShortModalNavBar from "../../components/atoms/ShortModalNavBar.js";
import ModalLoader from "../../components/atoms/ModalLoader.js";

import { selectGlobalAuthLoading, selectIsSignedIn, setGlobalAuthLoading, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice.js";

import { removeItem } from "../../components/lib/asyncStorage.js";

const { width } = Dimensions.get("window");

const BurgerMenu = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const height = Dimensions.get("window").height;

    const fontSize = width * 0.05;

    const globalAuthLoading = useSelector(selectGlobalAuthLoading);
    const isSignedIn = useSelector(selectIsSignedIn);

    const handleSignOut = async () => {
        dispatch(setGlobalAuthLoading(true))
        
        await fetch("https://banturide-api.onrender.com/auth/signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then( async (data) => {
            if(data.success === false) {
                throw new Error(data.message || data.error)
            } else {
                await SecureStore.deleteItemAsync("tokens").then( async () => {
                    await removeItem("userInfo").then(() => {
                        console.log("gothere")
                        dispatch(setUserInfo(null))
                        dispatch(setToken(null))
                        dispatch(setIsSignedIn(!isSignedIn))
                        dispatch(setTokenFetched(false))
                        dispatch(setUserDataFetched(false))
                        dispatch(setUserDataSet(false))
                    })
                })
            }
        })
        .catch((error) => {
            if(error === "Unauthorized"){
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setUserDataSet(false))
            } else {
                dispatch(setGlobalAuthLoading(false))
                if(typeof error === "string"){
                    dispatch(setError(error))
                } else {
                    dispatch(setError("Unknown error occcured"))
                }
                setTimeout(() => {
                    setError(false)
                }, 4000)
            }
        })
    }
    
    return(
        <View style={{height: height}} className="w-full flex-col justify-end relative">

            <Modal transparent={true} animationType="fade" visible={globalAuthLoading} onRequestClose={() => {
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

             {error &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit px-4 h-[90%] bg-red-600 rounded-[50px] flex items-center justify-center`}>
                        <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-medium text-center tracking-tight">{error}</Text>
                    </View>
                </View>
            }

            <View className={`h-[30%] relative z-10 w-full ${props.theme === "light" ? "bg-white" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-2xl rounded-t-2xl`}>
                <View className={`w-full h-[7%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <BurgerMenuItem theme={props.theme} iconName="info" text="About" handlePress={() => {
                    navigation.navigate("About")
                }}/>
                <TouchableOpacity className={`h-[25%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={handleSignOut}>
                    <MaterialIcons name="logout" size={fontSize * 1.7} color={`${props.theme === "dark" ? "white" : "black"}`} />
                    <Text style={{fontSize: fontSize * 0.8}} className={`font-bold tracking-tight ml-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign Out</Text>
                </TouchableOpacity>
                <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[20%]`}></View>
            </View>
        </View>
    )
}

export default BurgerMenu;