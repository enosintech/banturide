import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { addChatMessage, selectChatMessages, selectDriver } from '../../../slices/navSlice';
import { selectUserInfo } from '../../../slices/authSlice';

import MessageComponent from '../../components/atoms/MessageComponent.js';
import { useSocket } from '../../components/atoms/Socket';

const { width } = Dimensions.get("window");

const ContactDriver = (props) => {

  const { socket, connected } = useSocket();

  const dispatch = useDispatch();

  const height = Dimensions.get('window').height;

  const navigation = useNavigation();

  const driver = useSelector(selectDriver);
  const userInfo = useSelector(selectUserInfo);
  const chatMessages = useSelector(selectChatMessages);

  const fontSize = width * 0.05;

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {

    if(!socket) {
      console.log("Socket not Connected")
    }

    const hour =
        new Date().getHours() < 10
            ? `0${new Date().getHours()}`
            : `${new Date().getHours()}`;

    const mins =
        new Date().getMinutes() < 10
            ? `0${new Date().getMinutes()}`
            : `${new Date().getMinutes()}`;

    if(message.trim()) {
      const messageData = {
        id: `${userInfo.userId}-${Date.now()}`,
        time: `${hour}:${mins}`,
        text: message,
        recipientId: driver.userId,
        senderId: userInfo.userId
      };
      
      socket.emit("sendMessage", messageData);
      setMessage("");
      dispatch(addChatMessage(messageData));
    } else {
      console.log("PLease type a Message")
    }
  }


  useEffect(() => {

    if(!socket) return;

    socket.on('message', (data) => {
      dispatch(addChatMessage(data));
    });

    return () => {
      socket.off('message');
    };

  }, []);

  return (
        <KeyboardAvoidingView
          className="flex-1"
          style={{
            height: height,
            backgroundColor: props.theme === "dark" ? "#222831" : ""
          }} 
          keyboardVerticalOffset={25}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className={`w-full h-full flex items-center ${props.theme === "dark" ? "bg-dark-primary" : ""}`}>
            <View className={`w-full h-[15%] flex-row items-end`}>
              <View className={`flex-row items-center justify-between w-full h-[60%] pr-4 pl-2`}>
                <View className={`flex-row items-center`}>
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Ionicons name="chevron-back" size={fontSize * 1.6} color={props.theme === "dark" ? "white" : "black"}/>
                  </TouchableOpacity>
                  <View className={`ml-2 w-14 h-14 rounded-full bg-green-500`}></View>
                  <View className={`flex ml-3`}>
                    <Text style={{fontSize: fontSize }} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{driver?.firstname} {driver?.lastname}</Text>
                    <Text style={{fontSize: fontSize * 0.65}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>BAE 3155</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className={`w-[90%] mt-1 h-0 border-b ${props.theme === "dark" ? "border-white" : "border-gray-300" }`}></View>
            <View className={`w-full h-[72%] px-4 py-3 ${props.theme === "dark" ? "bg-dark-primary" : ""}`}>
              {chatMessages[0] ? (
                  <FlatList
                      data={chatMessages}
                      renderItem={({ item }) => (
                          <MessageComponent theme={props.theme} item={item} user={userInfo?.userId}/>
                      )}
                      keyExtractor={(item) => item.id}
                  />
                ) : (
                  ""
                )}
            </View>
            <View className={`w-[95%] h-[10%] flex-row items-center justify-between`}>
              <View className={`w-[80%] h-[80%] flex items-end justify-center`}>
                <TextInput 
                  className={`${props.theme === "dark" ? "bg-dark-secondary text-white" : "bg-white text-black"} shadow-sm h-[90%] w-[98%] p-2 text-[15px] rounded-full`}
                  placeholder="Type Message"
                  style={{fontFamily: "os-sb"}}
                  placeholderTextColor="rgb(156 163 175)"
                  onChangeText={(x) => setMessage(x)}
                  defaultValue={message}
                />
              </View>
              <TouchableOpacity className={`w-[18%] h-[72%] rounded-[100px] mr-[3px] flex items-center justify-center shadow-sm bg-[#186f65]`} onPress={handleSendMessage}>
                <Ionicons name="send" size={fontSize * 1.4} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
  )
}

export default ContactDriver;