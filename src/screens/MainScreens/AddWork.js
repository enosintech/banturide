import {Text, View, TextInput, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";

const AddWork = (props) => {
    const navigation = useNavigation();

    return(
        <View className="flex-1 flex-col justify-end">
             <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[30%] rounded-t-2xl shadow-2xl`}>
                <View className={`w-full h-[5%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className={`w-full h-[20%] px-3 items-center flex-row`}>
                    <MaterialIcons name="work" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[25px]`}> Add Work</Text>
                </View>
                <View className={`w-full h-[40%] items-center`}>
                    <TextInput
                        className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[50%] w-[85%] mt-5 border-2 p-2 text-[15px] border-solid rounded-2xl`}
                        placeholder="Address"
                        style={{fontFamily: "os-sb"}}
                        placeholderTextColor= "rgb(156 163 175)"
                    />
                </View>
                <View className={`w-full h-[25%] items-center`}>
                    <TouchableOpacity className="bg-[#186F65] shadow-lg w-[85%] h-[80%] rounded-2xl flex justify-center items-center" onPress={() => {
                        navigation.goBack()
                    }}>
                        <Text style={{fontFamily: "os-b"}} className="text-[17px] text-white">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddWork;