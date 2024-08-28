import {Text, View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { setFavAddressUpdated, selectFavAddressChanged, setFavAddressChanged } from "../../../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectIsSignedIn, selectToken, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import ModalLoader from "../../components/atoms/ModalLoader";
import ListLoadingComponent from "../../components/atoms/ListLoadingComponent";

const { width } = Dimensions.get("window");

const EditWork = (props) => {

    const routes = useRoute();

    const  { id } = routes.params;

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ workAddress, setWorkAddress ] = useState({
        description: "",
        location: "",
    })

    const tokens = useSelector(selectToken);
    const isSignedIn = useSelector(selectIsSignedIn);
    const favAddressChanged = useSelector(selectFavAddressChanged);

    const fontSize = width * 0.05;

    const editWorkForm = {
        address: workAddress?.description,
        locationId: id,
        name: "work"
    }

    const handleSaveWorkAddress = async () => {
        setLoading(true)

        await fetch("https://banturide-api.onrender.com/favorites/update-favorite", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens?.idToken}`,
                'x-refresh-token' : tokens?.refreshToken,
            },
            body: JSON.stringify(editWorkForm)
        })
        .then( response => response.json())
        .then( data => {
            if(data.success === false){
                throw new Error(data.message || data.error)
            } else {
                setLoading(false)
                navigation.navigate("Favorite", {saveMessage: "Work Address Edited Successfully"})
                dispatch(setFavAddressUpdated(true))
                setTimeout(() => {
                    dispatch(setFavAddressUpdated(false))
                }, 3000)
                dispatch(setFavAddressChanged(!favAddressChanged))
            }
        })
        .catch((err) => {
            if(err === "Unauthorized"){
                setLoading(false)
                dispatch(setUserInfo(null))
                dispatch(setToken(null))
                dispatch(setIsSignedIn(!isSignedIn))
                dispatch(setTokenFetched(false))
                dispatch(setUserDataFetched(false))
                dispatch(setUserDataSet(false))
            } else {
                setLoading(false)
                setError(err)
                setTimeout(() => {
                    setError(false)
                }, 3000)
            }
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

             <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[30%] rounded-t-2xl shadow-2xl items-center`}>
                <View className={`w-full h-[5%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                    <ShortModalNavBar theme={props.theme}/>
                </View>
                <View className={`w-full h-[20%] px-3 items-center flex-row`}>
                    <MaterialIcons name="work" size={fontSize * 1.6} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}> Edit Work</Text>
                </View>
                <View className={`w-full h-[30%] items-center justify-center relative z-20`}>
                <View className={`w-[90%] h-[75%] rounded-[25px] shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d]" : "bg-white border-gray-200"}`}>
                        <GooglePlacesAutocomplete 
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
                                    fontSize: fontSize * 0.85,
                                    height: "100%",
                                    width: "100%",
                                    fontWeight: "500",
                                    color: props.theme === "dark" ? "white" : "black",
                                    backgroundColor: "transparent"
                                },
                                listView: {
                                    position : "absolute",
                                    zIndex: 100,
                                    elevation: 10,
                                    top: 60,
                                    backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    height: 100,    
                                },
                                row: {
                                    backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                },
                                description: {
                                    color: props.theme === "dark" ? "white" : "black"
                                },
                            }}
                            textInputProps={{
                                placeholder: "Enter New Work Address",
                                placeholderTextColor: "gray"
                            }}
                            onPress={(data, details = null) => {
                                setWorkAddress({
                                    ...workAddress,
                                    location: details.geometry.location,
                                    description: data.description
                                })
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
                <View className={`w-[90%] h-[30%] rounded-[20px] ${props.theme === "dark" ? "border-[#222831] bg-dark-secondary" : "bg-white border-gray-200"} shadow border-[0.5px] flex flex-row justify-evenly items-center`}>
                    <TouchableOpacity className={`bg-red-700 shadow-sm w-[40%] h-[65%] rounded-[50px] flex justify-center items-center`} onPress={() => {
                        navigation.goBack();
                    }}>
                        <Text style={{fontSize: fontSize * 0.85 }} className="font-bold tracking-tight text-white">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={workAddress.description === "" ? true : false } onPress={handleSaveWorkAddress} className={`bg-[#186F65] shadow-sm w-[40%] h-[65%] rounded-[50px] flex justify-center items-center ${workAddress.description === "" ? "opacity-30" : "opacity-100"}`}>
                        <Text style={{fontSize: fontSize * 0.85 }} className="font-bold tracking-tight text-white">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default EditWork;