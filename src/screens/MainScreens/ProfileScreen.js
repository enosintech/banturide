import { Text, View, Image, TouchableOpacity, PixelRatio } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../slices/authSlice";
import { useEffect } from "react";

const ProfileScreen = (props) => {
    const navigation = useNavigation();

    const [notificationToggle, setNotificationToggle] = useState(true);
    const [callDriverToggle, setCallDriverToggle] = useState(false);

    const userInfo = useSelector(selectUserInfo);

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const handleToggleNotifications = async () => {

        if(notificationToggle === true){
            setNotificationToggle(false)
        } else {
            setNotificationToggle(true)
        }

        try {    
            const response = await fetch("https://banturide.onrender.com/profile/toggle-notifications", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    userId: userInfo.user._id,
                    value: !notificationToggle,
                })
            })
    
            const result = await response.json();
    
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleToggleDriverShouldCall = async () => {
        if(callDriverToggle === true){
            setCallDriverToggle(false)
        } else {
            setCallDriverToggle(true)
        }

        try {
            console.log("driver toggled")

            const response = await fetch("https://banturide.onrender.com/profile/toggle-driver-should-call", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    userId: userInfo.user._id,
                    value: !callDriverToggle
                })
            })

            const result = await response.json();

            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : ""} h-full w-full flex-1`}>
            <TouchableOpacity className={`absolute z-10 right-[3%] top-[8%] items-center justify-center`} onPress={() => {
                navigation.navigate("BurgerMenu")
            }}>
                <Ionicons name="menu" size={getFontSize(45)} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            
            <View className={`h-[28%] w-full absolute z-10 top-[15%] items-center`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-full w-full flex items-center justify-center`}>
                    <View className={`rounded-full h-[50%] w-[30%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid relative`}>
                        <Image source={require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                    </View>
                    <View className="mt-2">
                        <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}>{userInfo?.firstname + " " + userInfo?.lastname}</Text>
                    </View>
                </View>
            </View>

            <View className={`w-full h-full flex-col justify-between`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-[30%] w-full relative`}>
                   <Text style={{fontSize: getFontSize(18)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight absolute top-[30%] w-full text-center`}>PROFILE</Text>
                </View>

                <View className={`h-[55%] w-full items-center`}>
                    <TouchableOpacity className={`w-[95%] h-[12%] bg-white shadow-2xl rounded-[30px] flex-row items-center justify-center`} onPress={() => {
                        navigation.navigate("EditProfile")
                    }}>
                        <Feather name="edit" size={getFontSize(25)} color="black"/>
                        <Text style={{fontSize: getFontSize(18)}} className="text-black font-semibold tracking-tight"> Edit Profile</Text>
                    </TouchableOpacity>
                    <View className={`w-full border-b-[0.25px] mt-4 ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <MaterialIcons name="notifications" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Notifications</Text>
                        </View>
                        <TouchableOpacity onPress={handleToggleNotifications}>
                            <FontAwesome name={`${notificationToggle ? "toggle-on" : "toggle-off"}`} size={getFontSize(30)} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <Ionicons name="call" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Driver Should Call</Text>
                        </View>
                        <TouchableOpacity onPress={handleToggleDriverShouldCall}>
                            <FontAwesome name={`${callDriverToggle ? "toggle-on" : "toggle-off"}`} size={getFontSize(30)} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center`}>
                        <FontAwesome name="drivers-license" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Become A Driver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen;