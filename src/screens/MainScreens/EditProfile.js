import { useNavigation } from "@react-navigation/native";
import {Text, View, SafeAreaView, TouchableOpacity, Image, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

const EditProfile = (props) => {
    const navigation = useNavigation();

    return(
        <SafeAreaView className={`${props.theme === "dark"? "bg-[#222831]" : "bg-inherit"} w-full h-full`}>
            <View className={`w-full h-[10%] p-3`}>
                <TouchableOpacity className="flex-row items-center gap-2 w-[40%]" onPress={() => {
                    navigation.goBack()
                }}>
                    <Ionicons name="chevron-back" size={35} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <View className={`flex-row items-center`}>
                        <Feather name="edit" size={25} color={`${props.theme === "dark" ? "white" : "#186f65"}`} />
                        <Text style={{fontFamily: "os-light"}} className={`text-[20px] ${props.theme === "dark" ? "text-white" : "text-[#186f65]"}`}> Edit Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={`h-[30%] w-full items-center`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-full w-[95%] rounded-2xl flex items-center justify-center`}>
                    <View className={`rounded-full h-[50%] w-[30%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid`}>
                        <Image source={require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                    </View>
                    <View className="mt-2">
                        <Text style={{fontFamily: "os-reg"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[20px]`}>Enos Nsamba</Text>
                    </View>
                </View>
            </View>
            <View className={`w-full border-b-[0.5px] mt-1 border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <View className={`w-full h-[50%] mt-0.5 items-center`}>
                <TextInput 
                    className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[12%] w-[85%] mt-5 border-2 p-2 text-[15px] border-solid rounded-2xl`}
                    placeholder="Edit Name"
                    style={{fontFamily: "os-sb"}}
                    placeholderTextColor="rgb(156 163 175)"
                />

                <TextInput 
                    className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[12%] w-[85%] mt-5 border-2 p-2 text-[15px] border-solid rounded-2xl`}
                    placeholder="Edit Email"
                    style={{fontFamily: "os-sb"}}
                    placeholderTextColor="rgb(156 163 175)"
                />

                <TextInput 
                    className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[12%] w-[85%] mt-5 border-2 p-2 text-[15px] border-solid rounded-2xl`}
                    placeholder="Edit Address"
                    style={{fontFamily: "os-sb"}}
                    placeholderTextColor="rgb(156 163 175)"
                />

                <TextInput 
                    className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[12%] w-[85%] mt-5 border-2 p-2 text-[15px] border-solid rounded-2xl`}
                    placeholder="Edit Phone Number"
                    style={{fontFamily: "os-sb"}}
                    placeholderTextColor="rgb(156 163 175)"
                />
                <TouchableOpacity className="bg-[#186F65] shadow-lg w-[85%] h-[13%] mt-5 rounded-2xl flex justify-center items-center" onPress={() => {
                        navigation.goBack()
                    }}>
                        <Text style={{fontFamily: "os-b"}} className="text-[17px] text-white">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default EditProfile;