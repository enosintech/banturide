import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {Text, View, SafeAreaView, TouchableOpacity, ScrollView, PixelRatio } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import ProfileScreenTitle from "../../components/atoms/ProfileScreenTitle";
import NewNotification from "../../components/atoms/NewNotification";
import OldNotification from "../../components/atoms/OldNotification";

const NotificationsScreen = (props) => {
    const navigation = useNavigation();

    const [notifToggle, setNotifToggle] = useState("unread");

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

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
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="2 mins ago"/>
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="4 mins ago"/>
                        </ScrollView>
                    </View> 
                    : notifToggle === "read" 
                    ?
                    <View className={`w-full h-full bg-inherit mt-0.2`}>
                        <ScrollView className="w-full" contentContainerStyle={{
                            alignItems: "center"
                        }}>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="15 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="20 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="35 mins ago"/>
                        </ScrollView>
                    </View>
                    :
                    <View className={`w-full h-full bg-inherit mt-0.2`}>
                        <ScrollView className="w-full" contentContainerStyle={{
                            alignItems: "center"
                        }}>
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="2 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="20 mins ago"/>
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="4 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="15 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="35 mins ago"/>
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="2 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="15 mins ago"/>
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="4 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="20 mins ago"/>
                            <OldNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="35 mins ago"/>
                            <NewNotification theme={props.theme} title="Payment Confirmation" content="Your payment is successful" time="2 mins ago"/>
                        </ScrollView>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default NotificationsScreen;