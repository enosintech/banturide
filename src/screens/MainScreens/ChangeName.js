import { View, Text, Dimensions, TextInput, TouchableOpacity, Modal, Animated } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from "expo-secure-store";

import { selectIsSignedIn, selectToken, selectUserInfo, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from '../../../slices/authSlice';

import ModalLoader from '../../components/atoms/ModalLoader';
import { removeItem, setItem } from '../../components/lib/asyncStorage';
import { setDeliveryType, setDestination, setFavoritesData, setOrigin, setPassThrough, setPrice, setRecipient, setTravelTimeInformation, setTripDetails } from '../../../slices/navSlice';
import { clearAllNotifications } from '../../../slices/notificationSlice';
import ShortModalNavBar from '../../components/atoms/ShortModalNavBar';

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

    const { goBack } = useNavigation();
    const translateY = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        {
             useNativeDriver: true, 
        },
    )

    const onHandlerStateChange = useCallback(
        ({nativeEvent}) => {
            if (nativeEvent.state === 5) { // 5 is the value for `END` state
                if (nativeEvent.translationY > 150) { // Adjust threshold as needed
                    goBack(); // Close the modal
                } else {
                    Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    }).start();
                }
            }
        },
        [goBack, translateY]
    )

    const translateYClamped = translateY.interpolate({
        inputRange: [0, 9999],  // Large range to allow normal dragging
        outputRange: [0, 9999], // Mirrors input but clamps the lower bound to 0
        extrapolate: 'clamp',
    });

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
        const errorField = error.message || error.error;

        if(errorField === "Unauthorized"){
          await SecureStore.deleteItemAsync("tokens")
          .then( async () => {
            await removeItem("userInfo")
            .then(() => {
                dispatch(setDestination(null))
                dispatch(setOrigin(null))
                dispatch(setPassThrough(null))
                dispatch(setPrice(null))
                dispatch(setTravelTimeInformation(null))
                dispatch(setTripDetails(null))
                dispatch(setDeliveryType(null))
                dispatch(setRecipient(null))
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(clearAllNotifications())
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setFavoritesData([]))
                dispatch(setUserDataSet(false))
                dispatch(setGlobalUnauthorizedError("Please Sign in Again"))
                setTimeout(() => {
                    dispatch(setGlobalUnauthorizedError(false))
                }, 5000)
            })
          })
          .catch((error) => {
              setLoading(false)
              setError("Unauthorized")
              setTimeout(() => {
                  setError(false)
              }, 3000)
          })     
        } else {
          setLoading(false)
          setError(errorField || "Error Changing Name")
          setTimeout(() => {
            setError(false)
          }, 3000)
        }
      }
    }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={{transform: [{ translateY: translateYClamped}]}} className="w-full h-full flex-col justify-end relative">

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
                    <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof error === "string" ? error : "Server or Network Error Occurred"}</Text>
                </View>
            </View>
        }

        <View style={{height: 0.5 * height}} className={`w-full ${props.theme === "dark" ? "bg-dark-middle" : "bg-gray-50"} rounded-t-[40px] flex items-center justify-center gap-y-4 relative`}>
          <Text style={{fontSize: fontSize}} className={`absolute top-3 font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Edit Full Name</Text> 
          <TextInput 
              value={firstName}
              style={{fontSize: fontSize * 0.75}}
              className={`w-[90%] h-[15%] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} shadow border rounded-[25px] px-4`}
              placeholder="First Name"
              onChangeText={(x) => {setFirstName(x)}}
              keyboardType={"default"}
              autoComplete={"name"}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel="First Name Input"
              accessibilityHint="Enter your First Name"
          />
          <TextInput
              value={lastName} 
              style={{fontSize: fontSize * 0.75}}
              className={`w-[90%] h-[15%] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} shadow border rounded-[25px] px-4`}
              placeholder="Last Name"
              onChangeText={(x) => {setLastName(x)}}
              keyboardType={"default"}
              autoComplete={"family-name"}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel="Last Name Input"
              accessibilityHint="Enter your Last Name"
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
      </Animated.View>
    </PanGestureHandler>
  )
}

export default ChangeName;