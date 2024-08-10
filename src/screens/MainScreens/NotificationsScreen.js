import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {Text, View, SafeAreaView, TouchableOpacity, ScrollView, PixelRatio } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import ProfileScreenTitle from "../../components/atoms/ProfileScreenTitle";
import NewNotification from "../../components/atoms/NewNotification";
import OldNotification from "../../components/atoms/OldNotification";
import { useSelector } from "react-redux";
import { selectNotificationsArray } from "../../../slices/notificationSlice";

const NotificationsScreen = (props) => {

    const navigation = useNavigation();

    const [notifToggle, setNotifToggle] = useState("unread");

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const notificationsArray = useSelector(selectNotificationsArray);

    const unreadNotifications = notificationsArray.filter(notification => notification.status === "unread");

    const readNotifications = notificationsArray.filter(notification => notification.status === "read");

    return(
        <SafeAreaView className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-full`}>
            <View className={`w-full h-[18%]`}>
                <View className={`w-full h-[50%] p-3`}>
                    <ProfileScreenTitle theme={props.theme} iconName={"notifications"} title="Notifications" handlePress={() => {
                        navigation.goBack();
                    }}/>
                </View>
                <View className={`w-full h-[50%] items-center bg-inherit justify-center`}>
                    <View className={`w-[95%] mt-1 h-[50%] bg-white flex-row shadow-md border border-gray-100 rounded-2xl`}>
                        <TouchableOpacity className={`w-[50%] h-full items-center justify-center rounded-2xl ${notifToggle === "unread" ? "bg-[#186f65]" : "bg-white" }`} onPress={() => {
                            setNotifToggle("unread")
                        }}>
                            <Text style={{fontSize: getFontSize(14)}} className={`${notifToggle === "unread" ? "text-white" : "text-black"} tracking-tight`}>Unread</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={`w-[50%] h-full items-center justify-center rounded-2xl ${notifToggle === "read" ? "bg-[#186f65]" : "bg-white" }`} onPress={() => {
                            setNotifToggle("read")
                        }}>
                            <Text style={{fontSize: getFontSize(14)}} className={`${notifToggle === "read" ? "text-white" : "text-black"} tracking-normal`}>Read</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={`border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            </View>
            <View className={`w-full h-[68%] bg-inherit`}>
                <View className={`w-full h-[8%] ${props.theme === "dark" ? "bg-[#222831] border-gray-900" : " border-gray-400"} border-b-[0.25px] border-t-[0.25px] border-solid flex-row justify-end items-center px-3`}>
                    <TouchableOpacity className={`flex-row h-[80%] items-center rounded-2xl p-1 ${notifToggle === "all" ? "bg-[#186f65] border-[#186f65]" : "bg-white border-white"} shadow-md border`} onPress={() => {
                        setNotifToggle("all")
                    }}>
                        <Ionicons name="logo-stackoverflow" size={getFontSize(15)} color={`${notifToggle === "all" ? "white" : "black"}` }/>
                        <Text style={{fontSize: getFontSize(13)}} className={`${notifToggle === "all" ? "text-white" : "text-black"} tracking-tight`}> View all</Text>
                    </TouchableOpacity>
                </View>
                {
                    notifToggle === "unread"
                    ?
                    <View className={`w-full h-full mt-0.2`}>
                        <ScrollView className={`w-full`} contentContainerStyle={{
                            alignItems: "center"
                        }}>
                            {unreadNotifications.length > 0 ? 
                                unreadNotifications.map((notification, idx) => (
                                    <NewNotification key={notification.id} theme={props.theme} {...notification} time="4 mins ago"/>
                                ))
                            : 
                                <Text style={{fontSize: getFontSize(18)}} className={`mt-4 tracking-tight`}>No New Notifications</Text>
                            }
                        </ScrollView>
                    </View> 
                    : notifToggle === "read" 
                    ?
                    <View className={`w-full h-full bg-inherit mt-0.2`}>
                        <ScrollView className="w-full" contentContainerStyle={{
                            alignItems: "center"
                        }}>
                            {readNotifications.length > 0 ? 
                                readNotifications.map((notification, idx) => (
                                    <OldNotification key={notification.id} theme={props.theme} {...notification} time="35 mins ago"/>
                                ))
                            : 
                                <Text style={{fontSize: getFontSize(18)}} className={`mt-4 tracking-tight`}>No Read Notifications</Text>
                            }
                        </ScrollView>
                    </View>
                    :
                    <View className={`w-full h-full bg-inherit mt-0.2`}>
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
                                <Text style={{fontSize: getFontSize(18)}} className={`mt-4 tracking-tight`}>No Notifications</Text>
                            }
                        </ScrollView>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default NotificationsScreen;