import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { selectDriver } from '../../../slices/navSlice';

const ContactDriver = (props) => {

  const height = Dimensions.get('window').height;
  const navigation = useNavigation();

  const driver = useSelector(selectDriver);

  // const socket = useSelector((state) => state.websocket.socket);

  // const handleSendMessage = () => {
  //     if (socket && socket.readyState === WebSocket.OPEN) {
  //         socket.send(JSON.stringify({ type: 'sendMessage', recipientId: 'user456', content: 'Hello from Child Component!' }));
  //     } else {
  //         console.log('WebSocket is not connected');
  //     }
  // };

  return (
        <KeyboardAvoidingView
          className="flex-1"
          style={{
            height: height
          }} 
          keyboardVerticalOffset={25}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className={`w-full h-full flex items-center ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"}`}>
            <View className={`w-full h-[15%] flex-row items-end`}>
              <View className={`flex-row items-center justify-between w-full h-[60%] pr-4 pl-2`}>
                <View className={`flex-row items-center`}>
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Ionicons name="chevron-back" size={30} color={props.theme === "dark" ? "white" : "black"}/>
                  </TouchableOpacity>
                  <View className={`w-14 h-14 rounded-full bg-green-500`}></View>
                  <View className={`flex ml-2 bg-red-500 p-3 rounded-[20px] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"}`}>
                    <Text style={{fontFamily: "os-sb"}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{driver?.firstname} {driver?.lastname}</Text>
                    <Text style={{fontFamily: "os-mid"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>BAE 3155</Text>
                  </View>
                </View>
                {/* <TouchableOpacity className={`mr-2`}>
                  <Ionicons name="call" size={25} color={"#186f65"}/>
                </TouchableOpacity> */}
              </View>
            </View>
            <View className={`w-[90%] mt-1 h-0 border-b-2 ${props.theme === "dark" ? "" : "border-gray-200" }`}></View>
            <View className={`w-full h-[72%] ${props.theme === "dark" ? "bg-[#2d343d]" : "bg-white"}`}>
              <ScrollView>

              </ScrollView>
            </View>
            <View className={`w-full h-[10%] flex-row items-center justify-between`}>
              <View className={`w-[80%] h-[80%] flex items-end justify-center`}>
                <TextInput 
                  className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white border-gray-100 text-black"} shadow border h-[90%] w-[98%] p-2 text-[15px] border-solid rounded-2xl`}
                  placeholder="Type Message"
                  style={{fontFamily: "os-sb"}}
                  placeholderTextColor="rgb(156 163 175)"
                />
              </View>
              <TouchableOpacity className={`w-[18%] h-[72%] rounded-[20px] mr-[3px] flex items-center justify-center shadow border ${props.theme === "dark" ? "" : "bg-white border-gray-100"}`}>
                <Ionicons name="send" size={35} color="#186f65" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
  )
}

export default ContactDriver;