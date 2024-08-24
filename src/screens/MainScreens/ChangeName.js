import { View, Text, Dimensions, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { selectIsSignedIn, selectToken, selectUserInfo, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from '../../../slices/authSlice';

import ModalLoader from '../../components/atoms/ModalLoader';
import { setItem } from '../../components/lib/asyncStorage';

const width = Dimensions.get("window").width;

const ChangeName = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const userInfo = useSelector(selectUserInfo);
    const tokens = useSelector(selectToken);
    const isSignedIn = useSelector(selectIsSignedIn);

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const [ firstName, setFirstName ] = useState(userInfo?.firstname);
    const [ lastName, setLastName ] = useState(userInfo?.lastname)

    const height = Dimensions.get("window").height;

    const fontSize = width * 0.05;

    const getUpdatedUserProfile = async () => {
      const response = await fetch("https://banturide-api.onrender.com/profile/get-user-profile", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokens?.idToken}`,
              'x-refresh-token': tokens?.refreshToken,
          }
      });

      const data = await response.json();

      if(data.success === false) {
          throw new Error(data.message || data.error)
      } else {
          await setItem("userInfo", JSON.stringify(data.userData))
          dispatch(setUserInfo(data.userData))
      }
    }

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

        if(result.success === false) {
          throw new Error(result.message || result.error)
        } else {
            await getUpdatedUserProfile()
            .then(() => {
              setLoading(false)
              navigation.goBack();
            })
        }

      } catch (error) {
        if(error === "Unauthorized"){
          dispatch(setUserInfo(null))
          dispatch(setToken(null))
          dispatch(setIsSignedIn(!isSignedIn))
          dispatch(setTokenFetched(false))
          dispatch(setUserDataFetched(false))
          dispatch(setUserDataSet(false))
        } else {
          setLoading(false)
          if(typeof error === "string"){
            setError(error)
          } else {
            setError("There was an error")
          }
          setTimeout(() => {
            setError(false)
          }, 3000)
        }
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

      {error &&
          <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
              <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                  <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{error}</Text>
              </View>
          </View>
      }

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