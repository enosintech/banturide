import {Text, View, Image, TouchableOpacity} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../slices/authSlice";

const ProfileScreen = (props) => {
    const navigation = useNavigation();

    const [notificationToggle, setNotificationToggle] = useState(true);
    const [callDriverToggle, setCallDriverToggle] = useState(true);

    const userInfo = useSelector(selectUserInfo);

    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : ""} h-full w-full flex-1`}>
            <TouchableOpacity className={`absolute z-10 right-[3%] top-[8%] items-center justify-center`} onPress={() => {
                navigation.navigate("BurgerMenu")
            }}>
                <Ionicons name="menu" size={45} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            
            <View className={`h-[28%] w-full absolute z-10 top-[15%] items-center`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-full w-full flex items-center justify-center`}>
                    <View className={`rounded-full h-[50%] w-[30%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid`}>
                        <Image source={require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                    </View>
                    <View className="mt-2">
                        <Text style={{fontFamily: "os-reg"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[20px]`}>{userInfo?.user.firstname + userInfo?.user.lastname}</Text>
                    </View>
                </View>
            </View>

            <View className={`w-full h-full flex-col justify-between`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-[30%] w-full relative`}>
                   <Text style={{fontFamily: "os-b"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} absolute text-[18px] top-[30%] w-full text-center`}>PROFILE</Text>
                </View>

                <View className={`h-[55%] w-full items-center`}>
                    <TouchableOpacity className={`w-[95%] h-[12%] bg-white shadow-2xl rounded-2xl flex-row items-center justify-center`} onPress={() => {
                        navigation.navigate("EditProfile")
                    }}>
                        <Feather name="edit" size={25} color="black"/>
                        <Text style={{fontFamily: "os-mid"}} className="text-black text-[18px]"> Edit Profile</Text>
                    </TouchableOpacity>
                    <View className={`w-full border-b-[0.25px] mt-4 ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
                    <TouchableOpacity className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center`} onPress={() => {
                        navigation.navigate("paymentmethod")
                    }}>
                        <MaterialIcons name="payments" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        <Text style={{fontFamily: "os-light"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}> Payment Methods</Text>
                    </TouchableOpacity>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <MaterialIcons name="notifications" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontFamily: "os-light"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}> Notifications</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setNotificationToggle(!notificationToggle)
                        }}>
                            <FontAwesome name={`${notificationToggle ? "toggle-on" : "toggle-off"}`} size={30} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <Ionicons name="call" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontFamily: "os-light"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}> Driver Should Call</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setCallDriverToggle(!callDriverToggle)
                        }}>
                            <FontAwesome name={`${callDriverToggle ? "toggle-on" : "toggle-off"}`} size={30} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center`}>
                        <FontAwesome name="drivers-license" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        <Text style={{fontFamily: "os-light"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}> Become A Driver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen;