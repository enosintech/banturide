import { Text, View, Image, TouchableOpacity, PixelRatio } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectToken, selectUserInfo } from "../../../slices/authSlice";
import { useEffect } from "react";
import { selectBooking } from "../../../slices/navSlice";

const ProfileScreen = (props) => {
    const navigation = useNavigation();

    const tokens = useSelector(selectToken);
    const booking = useSelector(selectBooking);

    const [notificationToggle, setNotificationToggle] = useState(true);
    const [callDriverToggle, setCallDriverToggle] = useState(false);

    const [ notificationAlert, setNotificationAlert ] = useState(false)
    const [ notificationValue, setNotificationValue ] = useState(false)

    const [ callDriverAlert, setCallDriverAlert ] = useState(false)
    const [ callDriverValue, setCallDriverValue ] = useState(false);

    const userInfo = useSelector(selectUserInfo);

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const handleToggleNotifications = async () => {

        if(notificationToggle === true){
            setNotificationToggle(false)
        } else {
            setNotificationToggle(true)
        }

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
            .then((data) => {
                console.log(data)
                setNotificationAlert(!notificationAlert)
                setNotificationValue(data.notificationsEnabled)
            })
            .catch((err) => {
                throw err;
            })
    
        } catch (error) {
            console.log(error)
        }
    }

    const handleToggleDriverShouldCall = async () => {
        if(callDriverToggle === true){
            setCallDriverToggle(false)
        } else {
            setCallDriverToggle(true)
        }

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
            .then((data) => {
                setCallDriverAlert(!callDriverAlert)
                setCallDriverValue(data.driverShouldCall)
            })
            .catch((err) => {
                throw err;
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    const updateBookingLocation = async (req, res) => {
        await fetch("https://banturide-api.onrender.com/location/update-booking-location", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens?.idToken}`,
                'x-refresh-token' : tokens?.refreshToken,
            },
            body: JSON.stringify({
                bookingId: "8tTIpjER8ujsMlDTkTQa",
                driverId: "LY1HpRCfgWamdErqMjWmsKRq7iR2"
            })
        }).then(response => response.json())
        .then(data => {
          console.log(data);
        })
    }

    useEffect(() => {
        updateBookingLocation();
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setNotificationAlert(false)
        }, 4000)
    }, [notificationAlert])

    useEffect(() => {
        setTimeout(() => {
            setCallDriverAlert(false)
        }, 4000)
    }, [callDriverAlert])

    return(
        <View className={`${props.theme === "dark" ? "bg-[#222831]" : ""} h-full w-full flex-1 relative`}>
            {notificationAlert &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-[50%] h-[80%] bg-black rounded-[10px] flex items-center justify-center`}>
                        <Text style={{fontSize: getFontSize(16)}} className="text-white font-light tracking-tight">{notificationValue ? "Notifications Enabled" : "Notifications Disabled"}</Text>
                    </View>
                </View>
            }

            {callDriverAlert &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-[50%] h-[80%] bg-black rounded-[10px] flex items-center justify-center`}>
                        <Text style={{fontSize: getFontSize(16)}} className="text-white font-light tracking-tight">{callDriverValue ? "Driver Call Enabled" : "Driver Call Disabled"}</Text>
                    </View>
                </View>
            }

            <TouchableOpacity className={`absolute z-10 right-[3%] top-[8%] items-center justify-center`} onPress={() => {
                navigation.navigate("BurgerMenu")
            }}>
                <Ionicons name="menu" size={getFontSize(45)} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            
            <View className={`h-[28%] w-full absolute z-10 top-[15%] items-center`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-full w-full flex items-center justify-center`}>
                    <View className={`rounded-full h-[50%] w-[30%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid relative`}>
                        <Image source={userInfo?.avatar ? { uri: userInfo?.avatar} : require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                    </View>
                    <View className="mt-2">
                        <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}>{userInfo?.firstname + " " + userInfo?.lastname}</Text>
                    </View>
                </View>
            </View>

            <View className={`w-full h-full flex-col justify-between`}>
                <View className={`${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} h-[30%] w-full relative`}>
                   <Text style={{fontSize: getFontSize(18)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight absolute top-[30%] w-full text-center`}>PROFILE</Text>
                </View>

                <View className={`h-[55%] w-full items-center`}>
                    <TouchableOpacity className={`w-[95%] h-[12%] bg-white shadow-2xl rounded-[30px] flex-row items-center justify-center`} onPress={() => {
                        navigation.navigate("EditProfile")
                    }}>
                        <Feather name="edit" size={getFontSize(25)} color="black"/>
                        <Text style={{fontSize: getFontSize(18)}} className="text-black font-semibold tracking-tight"> Edit Profile</Text>
                    </TouchableOpacity>
                    <View className={`w-full border-b-[0.25px] mt-4 ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <MaterialIcons name="notifications" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Notifications</Text>
                        </View>
                        <TouchableOpacity onPress={handleToggleNotifications}>
                            <FontAwesome name={`${notificationToggle ? "toggle-on" : "toggle-off"}`} size={getFontSize(30)} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <View className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center justify-between`}>
                        <View className="flex-row items-center">
                            <Ionicons name="call" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Driver Should Call</Text>
                        </View>
                        <TouchableOpacity onPress={handleToggleDriverShouldCall}>
                            <FontAwesome name={`${callDriverToggle ? "toggle-on" : "toggle-off"}`} size={getFontSize(30)} color={`${ props.theme === "dark" ? "white" : "black"}`}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className={`h-[12%] w-full border-t-[0.25px] border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" :"border-gray-400"} px-5 flex-row items-center`}>
                        <FontAwesome name="drivers-license" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                        <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight ml-1`}> Become A Driver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen;