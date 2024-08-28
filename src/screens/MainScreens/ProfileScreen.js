import { Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import { selectIsSignedIn, selectToken, selectUserInfo, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";
import { setItem } from "../../components/lib/asyncStorage";

const { width } = Dimensions.get("window");

const ProfileScreen = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const tokens = useSelector(selectToken);
    const userInfo = useSelector(selectUserInfo);
    const isSignedIn = useSelector(selectIsSignedIn);

    const [notificationToggle, setNotificationToggle] = useState(userInfo?.notificationsEnabled);
    const [callDriverToggle, setCallDriverToggle] = useState(userInfo?.driverShouldCall);

    const [ notificationAlert, setNotificationAlert ] = useState(false)
    const [ notificationError, setNotificationError ] = useState(false);
    const [ notificationValue, setNotificationValue ] = useState(false)

    const [ callDriverAlert, setCallDriverAlert ] = useState(false)
    const [ callDriverError, setCallDriverError ] = useState(false);
    const [ callDriverValue, setCallDriverValue ] = useState(false);

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
            await setItem("userInfo", JSON.stringify(data?.userData))
            dispatch(setUserInfo(data?.userData))
        }
    }

    const handleToggleNotifications = async () => {

        const previousState = notificationToggle;
        setNotificationToggle(!notificationToggle);

        try {    
            const response = await fetch("https://banturide-api.onrender.com/profile/toggle-notifications", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.idToken}`,
                    'x-refresh-token' : tokens?.refreshToken,
                },
                body: JSON.stringify({
                    value: !notificationToggle,
                })
            })
    
            await response.json()
            .then( async (data) => {
                if(data.success === false) {

                    throw new Error(data.message || data.error)

                } else {
                    await getUpdatedUserProfile()
                    .then(() => {
                        setNotificationAlert(true)
                        setNotificationValue(data?.value)
                        setTimeout(() => {
                            setNotificationAlert(false)
                        }, 3000)
                    })
                }
            })
    
        } catch (error) {
            if(error === "Unauthorized"){
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setUserDataSet(false))
            } else {
                setNotificationToggle(previousState)
                setNotificationError(error)
                setTimeout(() => {
                    setNotificationError(false)
                }, 3000)
            }
        }
    }

    const handleToggleDriverShouldCall = async () => {

        const previousState = callDriverToggle;
        setCallDriverToggle(!callDriverToggle);

        try {
            const response = await fetch("https://banturide-api.onrender.com/profile/toggle-driver-should-call", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.idToken}`,
                    'x-refresh-token' : tokens?.refreshToken,
                },
                body: JSON.stringify({
                    value: !callDriverToggle
                })
            })

            await response.json()
            .then(async (data) => {
                if(data.success === false) {
                    throw new Error(data.message || data.error)
                } else {
                    await getUpdatedUserProfile()
                    .then(() => {
                        setCallDriverAlert(true)
                        setCallDriverValue(data?.value)
                        setTimeout(() => {
                            setCallDriverAlert(false)
                        }, 3000)
                    })
                }
            })
            
        } catch (error) {
            if(error === "Unauthorized"){
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setUserDataSet(false))
            } else {
                setCallDriverToggle(previousState);
                setCallDriverError(error)
                setTimeout(() => {
                    setCallDriverError(false)
                }, 3000)
            }
        }
    }

    return(
        <View className={`${props.theme === "dark" ? "bg-dark-primary" : ""} h-full w-full flex-1 relative`}>

            {notificationAlert &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit h-[80%] px-6 bg-black rounded-[50px] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{notificationValue ? "Notifications Enabled" : "Notifications Disabled"}</Text>
                    </View>
                </View>
            }

            {notificationError &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof notificationError === "string" ? notificationError : "Server or Network Error Occurred"}</Text>
                    </View>
                </View>
            }

            {callDriverAlert &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit px-6 h-[80%] bg-black rounded-[50px] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{callDriverValue ? "Driver will Call" : "Driver won't Call"}</Text>
                    </View>
                </View>
            }

            {callDriverError &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof callDriverError === "string" ? callDriverError : "Server or Network Error Occurred"}</Text>
                    </View>
                </View>
            }

            <TouchableOpacity className={`absolute z-10 right-[3%] top-[8%] items-center justify-center`} onPress={() => {
                navigation.navigate("BurgerMenu")
            }}>
                <Ionicons name="menu" size={fontSize * 2.1} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            
            <View className={`h-[28%] w-full absolute z-10 top-[15%] items-center`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-full w-full flex items-center justify-center`}>
                    <View className={`rounded-full h-[50%] w-[30%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid relative`}>
                        <Image source={userInfo && userInfo?.avatar !== null ? { uri: userInfo.avatar} : require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                    </View>
                    <View className="mt-2">
                        <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}>{userInfo?.firstname + " " + userInfo?.lastname}</Text>
                    </View>
                </View>
            </View>

            <View className={`w-full h-full flex-col justify-between`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-[30%] w-full relative`}>
                   <Text style={{fontSize: fontSize * 0.9}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight absolute top-[30%] w-full text-center`}>PROFILE</Text>
                </View>

                <View className={`h-[55%] w-full items-center`}>
                    <TouchableOpacity className={`w-[95%] h-[12%] bg-white shadow-sm rounded-[50px] flex-row items-center justify-center`} onPress={() => {
                        navigation.navigate("EditProfile")
                    }}>
                        <Feather name="edit" size={fontSize * 1.5} color="black"/>
                        <Text style={{fontSize: fontSize * 0.9}} className="text-black font-semibold tracking-tight"> Edit Profile</Text>
                    </TouchableOpacity>
                    <View className={`w-full border-b-[0.25px] mt-4 ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <MaterialIcons name="notifications" size={fontSize * 1.5} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: fontSize * 0.75}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Notifications</Text>
                        </View>
                        <TouchableOpacity onPress={handleToggleNotifications}>
                            <FontAwesome name={`${notificationToggle ? "toggle-on" : "toggle-off"}`} size={fontSize * 1.5} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <Ionicons name="call" size={fontSize * 1.5} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: fontSize * 0.75}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Driver Should Call</Text>
                        </View>
                        <TouchableOpacity onPress={handleToggleDriverShouldCall}>
                            <FontAwesome name={`${callDriverToggle ? "toggle-on" : "toggle-off"}`} size={fontSize * 1.5} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center`}>
                        <FontAwesome name="drivers-license" size={fontSize * 1.3} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        <Text style={{fontSize: fontSize * 0.75}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Become A Driver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen;