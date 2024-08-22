import { View, Text, Dimensions, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { selectToken, selectUserInfo } from '../../../slices/authSlice';
import { selectProfileUpdated, setProfileUpdated } from '../../../slices/navSlice';

import ModalLoader from '../../components/atoms/ModalLoader';

const width = Dimensions.get("window").width;

const ChangeName = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const userInfo = useSelector(selectUserInfo);
    const profileUpdated = useSelector(selectProfileUpdated)

    const tokens = useSelector(selectToken);

    const [ loading, setLoading ] = useState(false);
    const [ firstName, setFirstName ] = useState(userInfo?.firstname);
    const [ lastName, setLastName ] = useState(userInfo?.lastname)

    const height = Dimensions.get("window").height;

    const fontSize = width * 0.05;

    const editUserName = async () => {
      
      try {
        setLoading(true)

        const response = await fetch(`https://banturide-api.onrender.com/profile/edit-username`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens?.idToken}`,
            'x-refresh-token' : tokens?.refreshToken,
        },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
          })
        })
  
        const result = await response.json();

        if(result) {
          dispatch(setProfileUpdated(!profileUpdated))
          setLoading(false)
          navigation.goBack();
        }

      } catch (error) {
        setLoading(false)
        console.log("this is the error", error)
      }
      
    }

  return (
    <View style={{height: height}} className="w-full flex-col justify-end relative">

      <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
        if(loading === true){
            return
        } else {
            setLoading(false)
        }
      }}>
        <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
            <ModalLoader theme={props.theme}/>
        </View>
      </Modal>

      <View className={`w-full h-[50%] ${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} rounded-t-[22px] flex items-center justify-center gap-y-4 relative`}>
        <Text style={{fontSize: fontSize}} className={`absolute top-3 font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Edit Full Name</Text> 
        <TextInput 
            value={firstName}
            style={{fontSize: fontSize * 0.75}}
            className={`w-[90%] h-[15%] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} shadow border rounded-[25px] px-4`}
            placeholder="First Name"
            onChangeText={(x) => {setFirstName(x)}}
        />
        <TextInput
            value={lastName} 
            style={{fontSize: fontSize * 0.75}}
            className={`w-[90%] h-[15%] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} shadow border rounded-[25px] px-4`}
            placeholder="Last Name"
            onChangeText={(x) => {setLastName(x)}}
        />
        <View className={`w-full h-[30%] flex flex-row items-start justify-evenly`}>
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }} className={`w-[40%] h-[60%] bg-red-600 rounded-[40px] shadow flex items-center justify-center`}>
                <Text style={{fontSize: 20}} className="font-bold tracking-tight text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={editUserName} className={`w-[40%] h-[60%] bg-[#186f65] rounded-[40px] shadow flex items-center justify-center`}>
                <Text style={{fontSize: 20}} className="font-bold tracking-tight text-white">Change Name</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChangeName;