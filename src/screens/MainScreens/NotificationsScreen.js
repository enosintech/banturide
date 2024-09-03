import {Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import ProfileScreenTitle from "../../components/atoms/ProfileScreenTitle";
import NewNotification from "../../components/atoms/NewNotification";
import OldNotification from "../../components/atoms/OldNotification";

import { selectNotificationsArray, clearOldNotifications, clearAllNotifications } from "../../../slices/notificationSlice";

const { width } = Dimensions.get("window");

const NotificationsScreen = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [notifToggle, setNotifToggle] = useState("unread");

    const fontSize = width * 0.05;

    const notificationsArray = useSelector(selectNotificationsArray);

    const unreadNotifications = notificationsArray.filter(notification => notification.status === "unread");

    const readNotifications = notificationsArray.filter(notification => notification.status === "read");

    return(
        <SafeAreaView className={`${props.theme === "dark" ? "bg-[#222831]" : ""} w-full h-full`}>
            <View className={`w-full h-[18%]`}>
                <View className={`w-full h-[50%] p-3`}>
                    <ProfileScreenTitle theme={props.theme} iconName={"notifications"} title="Notifications" handlePress={() => {
                        navigation.goBack();
                    }}/>
                </View>
                <View className={`w-full h-[50%] items-center bg-inherit justify-center`}>
                    <View className={`w-[95%] mt-1 h-[50%] bg-white flex-row shadow-sm border border-gray-100 rounded-[50px]`}>
                        <TouchableOpacity className={`w-[50%] h-full items-center justify-center rounded-[50px] ${notifToggle === "unread" ? "bg-[#186f65]" : "bg-white" }`} onPress={() => {
                            setNotifToggle("unread")
                        }}>
                            <Text style={{fontSize: fontSize * 0.7}} className={`${notifToggle === "unread" ? "text-white" : "text-black"} tracking-tighter font-medium`}>Unread</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={`w-[50%] h-full items-center justify-center rounded-[50px] ${notifToggle === "read" ? "bg-[#186f65]" : "bg-white" }`} onPress={() => {
                            setNotifToggle("read")
                        }}>
                            <Text style={{fontSize: fontSize * 0.7}} className={`${notifToggle === "read" ? "text-white" : "text-black"} tracking-tighter font-medium`}>Read</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={`border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            </View>
            <View className={`w-full h-[76%]`}>
                <View className={`w-full h-[8%] ${props.theme === "dark" ? "bg-[#222831] border-gray-900" : " border-gray-400"} border-b-[0.25px] border-t-[0.25px] border-solid flex-row justify-end items-center px-3`}>
                    <TouchableOpacity className={`flex-row h-[80%] mr-2 items-center rounded-[50px] p-1 px-3 bg-white border-white shadow border`} onPress={() => {
                        dispatch(clearAllNotifications())
                    }}>
                        <MaterialCommunityIcons name="delete-sweep" size={fontSize * 0.85} color={`black`}/>
                        <Text style={{fontSize: fontSize * 0.65}} className={`text-black tracking-tighter font-medium`}> Clear all</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`flex-row h-[80%] items-center rounded-[50px] p-1 px-3 ${notifToggle === "all" ? "bg-[#186f65] border-[#186f65]" : "bg-white border-white"} shadow border`} onPress={() => {
                        setNotifToggle("all")
                    }}>
                        <Ionicons name="logo-stackoverflow" size={fontSize * 0.75} color={`${notifToggle === "all" ? "white" : "black"}` }/>
                        <Text style={{fontSize: fontSize * 0.65}} className={`${notifToggle === "all" ? "text-white" : "text-black"} tracking-tighter font-medium`}> View all</Text>
                    </TouchableOpacity>
                </View>
                {
                    notifToggle === "unread"
                    ?
                    <View className={`w-full h-[92%] mt-0.2`}>
                        <ScrollView className={`w-full`} contentContainerStyle={{
                            alignItems: "center",
                            paddingBottom: 30,
                        }}>
                            {unreadNotifications.length > 0 ? 
                                unreadNotifications.map((notification, idx) => (
                                    <NewNotification key={notification.id} theme={props.theme} {...notification} time="4 mins ago"/>
                                ))
                            : 
                                <Text style={{fontSize: fontSize * 0.85}} className={`mt-4 tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>No New Notifications</Text>
                            }
                        </ScrollView>
                    </View> 
                    : notifToggle === "read" 
                    ?
                    <View className={`w-full h-[92%] mt-0.2`}>
                        <ScrollView className="w-full" contentContainerStyle={{
                            alignItems: "center"
                        }}>
                            {readNotifications.length > 0 ? 
                                readNotifications.map((notification, idx) => (
                                    <OldNotification key={notification.id} theme={props.theme} {...notification} time="35 mins ago"/>
                                ))
                            : 
                                <Text style={{fontSize: fontSize * 0.85}} className={`mt-4 tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Read Notifications</Text>
                            }
                        </ScrollView>
                    </View>
                    :
                    <View className={`w-full h-[92%] mt-0.2`}>
                        <ScrollView className="w-full" contentContainerStyle={{
                            alignItems: "center"
                        }}>
                            {notificationsArray.length > 0 ? 
                                notificationsArray.map((notification, idx) => (
                                    notification.status === "read" 
                                    ?
                                    <OldNotification key={notification.id} {...notification} theme={props.theme} time="35 mins ago"/>
                                    :
                                    <NewNotification key={notification.id} {...notification} theme={props.theme} time="4 mins ago"/>
                                ))
                            : 
                                <Text style={{fontSize: fontSize * 0.85}} className={`mt-4 tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Notifications</Text>
                            }
                        </ScrollView>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default NotificationsScreen;