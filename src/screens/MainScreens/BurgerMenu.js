import { useNavigation } from "@react-navigation/native";
import {Text, View, TouchableOpacity, Dimensions } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BurgerMenuItem from "../../components/atoms/BurgerMenuItem.js";
import ShortModalNavBar from "../../components/atoms/ShortModalNavBar.js";
import { selectIsSignedIn, setIsSignedIn } from "../../../slices/authSlice.js";
import LoadingBlur from "../../components/atoms/LoadingBlur.js";
import { removeItem } from "../../components/lib/asyncStorage.js";

const BurgerMenu = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isSignedIn = useSelector(selectIsSignedIn)

    const [ loading, setLoading ] = useState(false);

    const height = Dimensions.get("window").height;

    const handleSignOut = async () => {
        setLoading(true)
        await SecureStore.deleteItemAsync("user").then(() => {
            dispatch(setIsSignedIn(!isSignedIn))
            setTimeout(() => {
                setLoading(false)
            }, 5000)
        }).catch((err) => {
            setLoading(false)
            console.log(err)
        })
    }
    
    return(
        <View style={{height: height}} className="w-full flex-col justify-end relative">
            <LoadingBlur color={"transparent"} loading={loading} />
            <View className={`h-[70%] relative z-10 w-full ${props.theme === "light" ? "bg-white" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-2xl rounded-t-2xl`}>
                <View className={`w-full h-[3%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className={`h-[10%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-2`}>
                    <Text style={{fontFamily: "os-reg"}} className={`text-[18px] ${props.theme === "light" ? "text-black" : props.theme === "dark" ? "text-white" : "text-black"}`}>Dark Mode: </Text>
                    <TouchableOpacity onPress={() => {
                        props.toggleDarkMode()
                    }}>
                        <FontAwesome name={`${props.theme === "dark" ? "toggle-on" : "toggle-off"}`} size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    </TouchableOpacity>
                </View>
                <BurgerMenuItem theme={props.theme} iconName="history" text="History" handlePress={() => {
                    navigation.navigate("History")
                }}/>
                <BurgerMenuItem theme={props.theme} iconName="comment" text="Complain" handlePress={() => {
                    navigation.navigate("Complain")
                }}/>
                <BurgerMenuItem theme={props.theme} iconName="ios-share" text="Referral" handlePress={() => {
                    navigation.navigate("Referral")
                }} />
                <BurgerMenuItem theme={props.theme} iconName="info" text="About Us" handlePress={() => {
                    navigation.navigate("About")
                }}/>
                <BurgerMenuItem theme={props.theme} iconName="settings" text="Settings" handlePress={() => {
                    navigation.navigate("Settings")
                }}/>
                <BurgerMenuItem theme={props.theme} iconName="help" text="Help and Support" handlePress={() => {
                    navigation.navigate("Support")
                }}/>
                <TouchableOpacity className={`h-[10%] w-full border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} flex-row items-center p-3`} onPress={handleSignOut}>
                    <MaterialIcons name="logout" size={30} color={`${props.theme === "dark" ? "white" : "black"}`} />
                    <Text style={{fontFamily: "os-b"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Sign Out</Text>
                </TouchableOpacity>
                <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[20%]`}></View>
            </View>
        </View>
    )
}

export default BurgerMenu;