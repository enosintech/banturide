import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, Dimensions, PixelRatio, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../slices/authSlice';

const ChangeName = (props) => {

    const navigation = useNavigation()

    const userInfo = useSelector(selectUserInfo);

    const [ firstName, setFirstName ] = useState(userInfo?.user?.firstname);
    const [ lastName, setLastName ] = useState(userInfo?.user?.lastname)

    const height = Dimensions.get("window").height;

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

  return (
    <View style={{height: height}} className="w-full flex-col justify-end relative">
      <View className={`w-full h-[50%] ${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} rounded-t-[22px] flex items-center justify-center gap-y-4 relative`}>
        <Text style={{fontSize: getFontSize(20)}} className={`absolute top-3 font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Edit Full Name</Text> 
        <TextInput 
            value={firstName}
            style={{fontSize: getFontSize(16)}}
            className={`w-[90%] h-[15%] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} shadow border rounded-[25px] px-4`}
            placeholder="First Name"
            onChangeText={(x) => {setFirstName(x)}}
        />
        <TextInput
            value={lastName} 
            style={{fontSize: getFontSize(16)}}
            className={`w-[90%] h-[15%] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} shadow border rounded-[25px] px-4`}
            placeholder="Last Name"
            onChange={(x) => {setLastName(x)}}
        />
        <View className={`w-full h-[30%] flex flex-row items-start justify-evenly`}>
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }} className={`w-[40%] h-[60%] bg-red-600 rounded-[40px] shadow flex items-center justify-center`}>
                <Text style={{fontSize: getFontSize(20)}} className="font-bold tracking-tight text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className={`w-[40%] h-[60%] bg-[#186f65] rounded-[40px] shadow flex items-center justify-center`}>
                <Text style={{fontSize: getFontSize(20)}} className="font-bold tracking-tight text-white">Change Name</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChangeName;