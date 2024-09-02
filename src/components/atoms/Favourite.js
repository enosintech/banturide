import {Text, TouchableOpacity, View, Dimensions, Modal } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as SecureStore from "expo-secure-store";

import ModalLoader from "./ModalLoader";

import { selectFavAddressChanged, setDeliveryType, setDestination, setFavAddressChanged, setFavoriteAddressDeleted, setOrigin, setPassThrough, setPrice, setRecipient, setTravelTimeInformation, setTripDetails } from "../../../slices/navSlice";
import { selectIsSignedIn, selectToken, setGlobalUnauthorizedError, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";

const { width } = Dimensions.get("window");

const Favorite = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const tokens = useSelector(selectToken)
    
    const [ loading, setLoading ] = useState(false);
    const [ error , setError ] = useState(false);
    const [ modalVisible, setModalVisible ] = useState(false);

    const favAddressChanged = useSelector(selectFavAddressChanged);
    const isSignedIn = useSelector(selectIsSignedIn);

    const fontSize = width * 0.05;

    const handleDeleteFavAddress = async () => {
        setLoading(true)
        try {
            const response = await fetch("https://banturide-api.onrender.com/favorites/delete-favorite", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.idToken}`,
                    'x-refresh-token' : tokens?.refreshToken,
                },
                body: JSON.stringify({
                    locationId: props.id,
                })
            })
            const result = await response.json();

            if(result.success === false) {
                throw new Error(result.message || result.error)
            } else {
                setModalVisible(false)
                dispatch(setFavoriteAddressDeleted("Address Deleted Successfully"))
                setTimeout(() => {
                    dispatch(setFavoriteAddressDeleted(false))
                }, 3000)
                dispatch(setFavAddressChanged(!favAddressChanged))
            }

        } catch (error) {
            const errorField = error.message || error.error;

            if(errorField === "Unauthorized"){
                await SecureStore.deleteItemAsync("tokens")
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
                    dispatch(setTokenFetched(false))
                    dispatch(setUserDataFetched(false))
                    dispatch(setUserDataSet(false))
                    dispatch(setGlobalUnauthorizedError("Please Sign in Again"))
                    setTimeout(() => {
                        dispatch(setGlobalUnauthorizedError(false))
                    }, 5000)
                })
                .catch((error) => {
                    setError("Unauthorized")
                    setTimeout(() => {
                        setError(false)
                    }, 3000)
                })     
            } else {
                setError(errorField || "Failed to delete Favorite location")
                setTimeout(() => {
                    setError(false)
                }, 3000)
            }
        } finally {
            setLoading(false)
        }
    }

    return(
        <View className={`${props.theme === "dark" ? "bg-dark-secondary" : "bg-white"} w-[95%] h-[85px] mb-1 mt-1 flex justify-center rounded-[15px] shadow-sm`}>
            
            <Modal visible={modalVisible} onRequestClose={() => {
                if(loading === true){
                    return
                } else {
                    setModalVisible(false)
                }
            }} animationType="fade" transparent={true}>
                <View style={{backgroundColor: "rgba(0,0,0,0.7)"}} className={`w-full h-full flex justify-end relative`}>
                    {error &&
                        <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                            <View className={`w-fit h-[80%] px-6 bg-red-700 rounded-[50px] flex items-center justify-center`}>
                                <Text style={{fontSize: fontSize * 0.8}} className="text-white font-light tracking-tight text-center">{typeof error === "string" ? error : "Server or Network Error Occurred"}</Text>
                            </View>
                        </View>
                    }

                    {loading && 
                        <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center absolute z-50`}>
                            <ModalLoader theme={props.theme} />
                        </View>
                    }

                    <View className={`w-full h-[30%] ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow rounded-t-[30px] flex items-center justify-evenly`}>
                        <Text style={{fontSize: fontSize * 0.85}} className={`text-center w-[80%] font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Are you sure you want to remove this Saved Address?</Text>
                        <View className="flex flex-row items-center justify-evenly w-full h-[40%]">
                            <TouchableOpacity onPress={() => setModalVisible(false)} className={`w-[40%] h-[70%] bg-red-600 rounded-[40px] flex items-center justify-center`}>
                                <Text style={{fontSize: fontSize * 0.80}} className="text-white font-bold tracking-tight">Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteFavAddress} className={`w-[40%] h-[70%] bg-[#186f65] rounded-[40px] flex items-center justify-center`}>
                                <Text style={{fontSize: fontSize * 0.80}} className="text-white font-bold tracking-tight">Remove Address</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View className={`flex-row items-center justify-between px-3 py-2`}>
                <View className="flex-row items-center -translate-y-1">
                    {props.iconName ? 
                    <MaterialIcons name={props.iconName} size={fontSize * 0.7} color={`#186f65`}/>
                    : 
                    <Ionicons name="location" size={fontSize * 0.7} color={`#186f65`}/>
                    }
                    <Text style={{fontSize: fontSize * 0.85}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}> {props.addName}</Text>
                </View>
                <View className="flex flex-row gap-x-1 -translate-y-2 -translate-x-1">
                    <TouchableOpacity onPress={() => {
                        if(props.iconName && props.iconName === "home-filled"){
                            navigation.navigate("edithome", {
                                id: props.id,
                            })
                        } else if(props.iconName && props.iconName === "work"){
                            navigation.navigate("editwork", {
                                id: props.id
                            })
                        } else {
                            navigation.navigate("editlocation", {
                                id: props.id
                            })
                        }
                    }}>
                        <MaterialCommunityIcons name="pencil-circle" size={fontSize * 1.2} color={`#186f65`}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true)
                    }}>
                        <Entypo name="circle-with-minus" size={fontSize * 1.2} color={`${props.theme === "dark" ? "#dc2626" : "#b91c1c"}`}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="px-4 -translate-y-1">
                <Text style={{fontSize: fontSize * 0.5}} className={`font-medium tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.address.description.split(",")[0]}</Text>
            </View>
        </View>
    )
}

export default Favorite;