import { Text, View, TouchableOpacity, Image, Modal, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import * as SecureStore from "expo-secure-store";

import { selectIsSignedIn, selectToken, selectUserInfo, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";

import LoadingBlur from "../../components/atoms/LoadingBlur";
import { removeItem, setItem } from "../../components/lib/asyncStorage";
import { setDeliveryType, setDestination, setFavoritesData, setOrigin, setPassThrough, setPrice, setRecipient, setTravelTimeInformation, setTripDetails } from "../../../slices/navSlice";
import { clearAllNotifications } from "../../../slices/notificationSlice";

const { width } = Dimensions.get("window");

const EditProfile = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const userInfo = useSelector(selectUserInfo);
    const isSignedIn = useSelector(selectIsSignedIn);
    const tokens = useSelector(selectToken);

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ image, setImage ] = useState()
    const [ loading, setLoading ] = useState(false)

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

    const saveImage = async (imageParam) => {
        setModalVisible(false)
        setLoading(true)

        setImage(imageParam)

        const formData = new FormData();
        formData.append('userId', userInfo?.userId);
        formData.append('avatar', {
            uri: imageParam.uri,
            type: imageParam.type,
            name: imageParam.fileName
        })      

        const response = await fetch(`https://banturide-api.onrender.com/profile/uploadUserProfilePicture`, {
            method: "POST",
            headers: {
                "Content-Type" : "multipart/form-data",
                'Authorization': `Bearer ${tokens?.idToken}`,
                'x-refresh-token' : tokens?.refreshToken,
            },
            body: formData,
        })

        const responseData = await response.json();
        
        if(responseData.success === false) {
            throw new Error(data.message || data.error)
        } else {
            await getUpdatedUserProfile()
            .then(() => {
                setLoading(false)
            })
        }
    }

    const uploadImage = async (mode) => {
        try {

            let result = {};

            if( mode === "gallery"){

                await ImagePicker.requestMediaLibraryPermissionsAsync();

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                })

            } else {
                
                await ImagePicker.requestCameraPermissionsAsync();
    
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                })
            }
            
            if(!result.canceled){
                await saveImage(result.assets[0])
            }

        } catch(error) {
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
                    setModalVisible(false)
                    setLoading(false)
                    setError("Unauthorized")
                    setTimeout(() => {
                        setError(false)
                    }, 3000)
                })     
            } else {
                setModalVisible(false)
                setLoading(false)
                setError(errorField || "Failed to upload Image")
                setTimeout(() => {
                    setError(false)
                }, 3000)
            }
        }
    }

    const removeImage = async () => {
        setModalVisible(false)
        setLoading(true)
        try {

            const response = await fetch(`https://banturide-api.onrender.com/profile/removeUserProfilePicture`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.idToken}`,
                    'x-refresh-token' : tokens?.refreshToken,
                },
            })

            const responseData = await response.json();

            if(responseData.success === false) {

                throw new Error(responseData.message || responseData.error)

            } else {
                await getUpdatedUserProfile()
                .then(() => {
                    setLoading(false)
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
                    setModalVisible(false)
                    setLoading(false)
                    setError("Unauthorized")
                    setTimeout(() => {
                        setError(false)
                    }, 3000)
                })     
            } else {
                setModalVisible(false)
                setLoading(false)
                setError(errorField || "failed to remove Image")
                setTimeout(() => {
                    setError(false)
                }, 3000)
            }
        }
    }

    return(
        <SafeAreaView className={`${props.theme === "dark"? "bg-dark-primary" : ""} w-full h-full relative`}>

            {error &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                        <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof error === "string" ? error : "Server or Network Error Occurred"}</Text>
                    </View>
                </View>
            }

            <Modal visible={loading} onRequestClose={() => {
                if(loading) {

                } else {
                    setLoading(false)
                }
            }} animationType="fade" presentationStyle="overFullScreen" transparent={true}>
                <LoadingBlur loading={loading} theme={props.theme} />
            </Modal>

            <Modal visible={modalVisible} onRequestClose={() => {setModalVisible(false)}} animationType="fade" presentationStyle="overFullScreen" transparent={true}>
                <View style={{backgroundColor: "rgba(0, 0, 0, 0.6)"}} className={`w-full h-full flex items-center justify-center relative`}>
                    <View className="absolute top-32 w-full h-[7%] flex items-center justify-center">
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false)
                        }} className={`w-14 h-14 flex items-center justify-center bg-red-700 rounded-full shadow`}>
                            <Ionicons name="close" size={fontSize * 1.6} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View className={`w-[90%] h-[30%] rounded-[35px] flex flex-row items-center justify-evenly`}>
                        <TouchableOpacity onPress={uploadImage} className={`w-[22%] h-[32%] ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"} border-2 shadow rounded-[25px] flex items-center justify-center`}>
                            <MaterialIcons name="add-a-photo" size={fontSize * 1.6} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight mt-1`}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => uploadImage("gallery")} className={`w-[22%] h-[32%] ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"} border-2 shadow rounded-[25px] flex items-center justify-center`}>
                            <MaterialIcons name="add-photo-alternate" size={fontSize * 1.8} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight mt-1`}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={removeImage} className={`w-[22%] h-[32%] ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"} border-2 shadow rounded-[25px] flex items-center justify-center`}>
                            <MaterialIcons name="delete" size={fontSize * 1.8} color={"gray"}/>
                            <Text style={{fontSize: fontSize * 0.5}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View className={`w-full h-[10%] p-3`}>
                <TouchableOpacity className="flex-row items-center gap-2 w-[40%]" onPress={() => {
                    navigation.goBack()
                }}>
                    <Ionicons name="chevron-back" size={fontSize * 1.8} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <View className={`flex-row items-center`}>
                        <Text style={{fontSize: fontSize}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}> Edit Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={`h-[30%] ${props.theme === "dark" ? "bg-dark-primary" : ""} w-full items-center shadow`}>
                <View className={` h-full w-[95%] rounded-2xl flex items-center justify-center`}>
                    <View className={`rounded-full relative h-[68%] w-[42%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid shadow`}>
                        <Image source={userInfo?.avatar !== null ? { uri: userInfo.avatar} : require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true)
                        }} className={`w-14 h-14 rounded-full absolute bottom-0 right-0 shadow border flex items-center justify-center ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"}`}>
                            <Ionicons name="camera" size={fontSize * 1.4} color={props.theme === "dark" ? "white" : "#186f65"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className={`w-full border-b-[0.5px] mt-1 border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <View className={`w-full h-[50%] mt-0.5 flex`}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("changeName");
                }} className={`w-full h-1/4 flex flex-row items-center justify-between px-5`}>
                    <View className={`flex h-full justify-center gap-y-2`}>
                        <Text style={{fontSize: fontSize * 1.1}} className={`font-black tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Name</Text>
                        <Text style={{fontSize: fontSize * 0.75}} className={`tracking-tight font-medium ${props.theme === "dark" ? "text-white" : "text-black"}`}>{userInfo?.firstname + " " + userInfo?.lastname}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={fontSize * 1.5} color={props.theme === "dark" ? "white" : "black"}/>       
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default EditProfile;