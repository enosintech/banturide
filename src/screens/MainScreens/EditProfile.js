import { useNavigation } from "@react-navigation/native";
import { Text, View, SafeAreaView, TouchableOpacity, Image, PixelRatio, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useSelector } from "react-redux";

import { safeViewAndroid } from "../AuthScreens/WelcomeScreen";
import { selectUserInfo } from "../../../slices/authSlice";

const EditProfile = (props) => {
    const navigation = useNavigation();

    const userInfo = useSelector(selectUserInfo);

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ image, setImage ] = useState()

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

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
                await saveImage(result.assets[0].uri)
            }

        } catch(error) {
            console.log(error)
            setModalVisible(false)
        }
    }

    const saveImage = async (imageParam) => {
        try {
            setImage(imageParam);

            setModalVisible(false);
        } catch (error) {
            throw error
        }
    }

    const removeImage = async () => {
        try {
            saveImage(null)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <SafeAreaView style={safeViewAndroid.AndroidSafeArea} className={`${props.theme === "dark"? "bg-[#222831]" : "bg-white"} w-full h-full relative`}>

            <Modal visible={modalVisible} onRequestClose={() => {setModalVisible(false)}} animationType="fade" presentationStyle="overFullScreen" transparent={true}>
                <View style={{backgroundColor: "rgba(0, 0, 0, 0.6)"}} className={`w-full h-full flex items-center justify-center relative`}>
                    <View className="absolute top-32 w-full h-[7%] flex items-center justify-center">
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false)
                        }} className={`w-14 h-14 flex items-center justify-center bg-red-700 rounded-full shadow`}>
                            <Ionicons name="close" size={getFontSize(30)} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View className={`w-[90%] h-[30%] ${props.theme === "dark" ? "" : "bg-white"} rounded-[35px] flex flex-row items-center justify-evenly`}>
                        <TouchableOpacity onPress={uploadImage} className={`w-[22%] h-[32%] ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"} border-2 shadow rounded-[25px] flex items-center justify-center`}>
                            <MaterialIcons name="add-a-photo" size={getFontSize(30)} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: getFontSize(11)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight mt-1`}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => uploadImage("gallery")} className={`w-[22%] h-[32%] ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"} border-2 shadow rounded-[25px] flex items-center justify-center`}>
                            <MaterialIcons name="add-photo-alternate" size={getFontSize(35)} color={props.theme === "dark" ? "white" : "black"}/>
                            <Text style={{fontSize: getFontSize(11)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight mt-1`}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={removeImage} className={`w-[22%] h-[32%] ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"} border-2 shadow rounded-[25px] flex items-center justify-center`}>
                            <MaterialIcons name="delete" size={getFontSize(35)} color={"gray"}/>
                            <Text style={{fontSize: getFontSize(11)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-bold tracking-tight`}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View className={`w-full h-[10%] p-3`}>
                <TouchableOpacity className="flex-row items-center gap-2 w-[40%]" onPress={() => {
                    navigation.goBack()
                }}>
                    <Ionicons name="chevron-back" size={getFontSize(35)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <View className={`flex-row items-center`}>
                        <Feather name="edit" size={getFontSize(25)} color={`${props.theme === "dark" ? "white" : "black"}`} />
                        <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium`}> Edit Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View className={`h-[30%] ${props.theme === "dark" ? "bg-[#1e252d]" : "bg-white"} w-full items-center shadow`}>
                <View className={` h-full w-[95%] rounded-2xl flex items-center justify-center`}>
                    <View className={`rounded-full relative h-[68%] w-[42%] ${props.theme === "dark" ? "border-white" : "border-gray-100"} border-4 border-solid shadow`}>
                        <Image source={image ? {uri: image} : require("../../../assets/images/profileplaceholder.png")} className=" h-full w-full rounded-full" style={{resizeMode: "contain"}}/>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true)
                        }} className={`w-14 h-14 rounded-full absolute bottom-0 right-0 shadow-sm border flex items-center justify-center ${props.theme === "dark" ? "bg-[#1e252d] border-[#1e252d]" : "bg-white border-gray-100"}`}>
                            <Ionicons name="camera" size={getFontSize(30)} color={props.theme === "dark" ? "white" : "black"} />
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
                        <Text style={{fontSize: getFontSize(22)}} className={`font-bold tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Name</Text>
                        <Text style={{fontSize: getFontSize(16)}} className={`tracking-tight font-light ${props.theme === "dark" ? "text-white" : "text-black"}`}>{userInfo?.firstname + " " + userInfo?.lastname}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={getFontSize(28)} color={props.theme === "dark" ? "white" : "black"}/>       
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default EditProfile;