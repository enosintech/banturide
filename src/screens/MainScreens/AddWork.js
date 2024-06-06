import {Text, View, TouchableOpacity, PixelRatio, Modal } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useEffect, useRef, useState } from "react";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../../slices/authSlice";
import { selectFavoriteWorkAddress, setFavoriteWorkAddress, setFavAddressUpdated, selectFavAddressChanged, setFavAddressChanged } from "../../../slices/navSlice";
import ModalLoader from "../../components/atoms/ModalLoader";
import ListLoadingComponent from "../../components/atoms/ListLoadingComponent";

const AddWork = (props) => {

    const userInfo = useSelector(selectUserInfo);
    const workAddress = useSelector(selectFavoriteWorkAddress);
    const favAddressChanged = useSelector(selectFavAddressChanged);

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const workAddressRef = useRef(null);

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    useEffect(() => {
        workAddressRef?.current.setAddressText(workAddress.description)
    }, [workAddress])

    const addWorkForm = {
        userId: userInfo?.user?._id,
        type: "work",
        address: workAddress?.description,
        name: ""
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(addWorkForm)
    }

    const handleSaveWorkAddress = async () => {
        setLoading(true)

        await fetch("https://banturide.onrender.com/favorites/add-favorites", options)
        .then( response => response.json())
        .then( data => {
            if(data.success === false){
                setLoading(false)
                setError(data.message)
                setTimeout(() => {
                    setError("")
                }, 4000)
            } else {
                setLoading(false)
                navigation.navigate("Favorite", {saveMessage: "Work Address Added Successfully"})
                dispatch(setFavAddressUpdated(true))
                dispatch(setFavAddressChanged(!favAddressChanged))
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return(
        <View className="flex-1 flex-col justify-end">

            <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => {
                if(loading === true){
                    return
                } else {
                    setLoading(false)
                }
             }}>
                <View style={{backgroundColor: "rgba(0,0,0,0.6)"}} className={`w-full h-full flex items-center justify-center`}>
                    <ModalLoader />
                </View>
             </Modal>

             <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[30%] rounded-t-2xl shadow-2xl items-center`}>
                <View className={`w-full h-[5%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className={`w-full h-[20%] px-3 items-center flex-row`}>
                    <MaterialIcons name="work" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontSize: getFontSize(25)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}> Add Work</Text>
                </View>
                <View className={`w-full h-[30%] items-center justify-center relative z-20`}>
                <View className={`w-[90%] h-[75%] rounded-[25px] shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d]" : "bg-white border-gray-200"}`}>
                        <GooglePlacesAutocomplete 
                            ref={workAddressRef}
                            styles={{
                                container: {
                                    width: "100%",
                                    height: "100%",
                                },
                                textInputContainer: {
                                    height: "100%",
                                    width: "100%",
                                },
                                textInput: {
                                    fontSize: getFontSize(18),
                                    height: "100%",
                                    width: "100%",
                                    fontWeight: "500",
                                    color: props.theme === "dark" ? "white" : "black",
                                    backgroundColor: "transparent"
                                },
                                listView: {
                                    position : "absolute",
                                    zIndex: 100,
                                    elevation: getFontSize(100),
                                    top: getFontSize(60),
                                    backgroundColor: "white",
                                    borderBottomLeftRadius: getFontSize(20),
                                    borderBottomRightRadius: getFontSize(20),
                                    height: getFontSize(100)    
                                }
                            }}
                            textInputProps={{
                                placeholder: "Enter Work Address",
                                placeholderTextColor: "gray"
                            }}
                            onPress={(data, details = null) => {
                                dispatch(setFavoriteWorkAddress({
                                    ...workAddress,
                                    location: details.geometry.location,
                                    description: data.description
                                }))
                            }}
                            listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme}/>}
                            listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme}/>}
                            query={{
                                key: api,
                                language: "en",
                                components: "country:zm"
                            }}
                            fetchDetails={true}
                            enablePoweredByContainer={false}
                            minLength={1}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            debounce={100}
                        />
                    </View>
                </View>
                <View className={`w-[90%] h-[30%] rounded-[20px] ${props.theme === "dark" ? "border-[#222831] bg-[#222831]" : "bg-white border-gray-200"} shadow border-[0.5px] justify-center items-center`}>
                    <TouchableOpacity onPress={handleSaveWorkAddress} className="bg-[#186F65] shadow-lg w-[90%] h-[65%] rounded-[25px] flex justify-center items-center">
                        <Text style={{fontSize: getFontSize(18)}} className="font-bold tracking-tight text-white">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddWork;