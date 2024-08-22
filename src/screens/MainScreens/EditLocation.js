import {Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, Modal } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import ListLoadingComponent from "../../components/atoms/ListLoadingComponent";
import ModalLoader from "../../components/atoms/ModalLoader";

import { selectToken } from "../../../slices/authSlice";
import { selectFavAddressChanged, setFavAddressChanged, setFavAddressUpdated } from "../../../slices/navSlice";

const { width } = Dimensions.get("window");

const EditLocation = (props) => {

    const routes = useRoute();

    const { id } = routes.params; 

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const tokens = useSelector(selectToken);
    const favAddressChanged = useSelector(selectFavAddressChanged);

    const [ locationName, setLocationName ] = useState("");
    const [ locationAddress, setLocationAddress ] = useState({
        description: "",
        location: "",
    });

    const [ loading, setLoading ] = useState(false);

    const fontSize = width * 0.05;

    const editLocationForm = {
        address: locationAddress?.description,
        name: locationName,
        locationId: id
    }
    
    const handleSaveLocationAddress = async () => {
        setLoading(true)

        await fetch("https://banturide-api.onrender.com/favorites/update-favorite", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens?.idToken}`,
                'x-refresh-token' : tokens?.refreshToken,
            },
            body: JSON.stringify(editLocationForm)
        })
        .then( response => response.json())
        .then(data => {
            if(data.success === false){
                setLoading(false)
                console.log(data.message)
            } else {
                setLoading(false)
                navigation.navigate("Favorite", {saveMessage: `${locationName} Address Edited Successfully`})
                dispatch(setFavAddressUpdated(true));
                dispatch(setFavAddressChanged(!favAddressChanged))
            }
        })
        .catch((err) => {
            console.log(err)
        })
    
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0} style={{flex:1}}>
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
                    
                    <View className={`${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full h-[50%] rounded-t-2xl shadow-2xl items-center`}>
                        <View className={`w-full h-[3%] border-b-[0.5px] border-solid ${props.theme === "light" ? "border-gray-100" : props.theme === "dark" ? "border-gray-900" : "border-gray-400"} rounded-t-2xl  items-center justify-center`}>
                            <ShortModalNavBar theme={props.theme}/>
                        </View>
                        <View className={`w-full h-[15%] px-3 items-center flex-row`}>
                            <MaterialIcons name="add-location" size={fontSize * 1.6} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                            <Text style={{fontSize: fontSize * 1.3}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>Edit Location</Text>
                        </View>
                        <View className={`w-full h-[40%] pt-2 items-center relative z-20`}>
                            <TextInput
                                className={`w-[90%] h-[36%] rounded-[25px] font-semibold tracking-tight shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d] text-white" : "bg-white border-gray-200 text-black"} px-2 `}
                                placeholder="Name"
                                style={{fontSize: fontSize * 0.75}}
                                placeholderTextColor="rgb(156 163 175)"
                                value={locationName}
                                onChangeText={(x) => {setLocationName(x)}}
                            />
                            <View className={`w-[90%] h-[36%] mt-5 rounded-[25px] shadow border-[0.5px] ${props.theme === "dark" ? "bg-[#2b3540] border-[#1e252d]" : "bg-white border-gray-200"}`}>
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
                                            fontSize: fontSize * 0.75,
                                            height: "100%",
                                            width: "100%",
                                            fontWeight: "600",
                                            color: props.theme === "dark" ? "white" : "black",
                                            backgroundColor: "transparent"
                                        },
                                        listView: {
                                            position : "absolute",
                                            zIndex: 100,
                                            elevation: 100,
                                            top: 70,
                                            backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                            borderBottomLeftRadius: 20,
                                            borderBottomRightRadius: 20,
                                            height: 150    
                                        },
                                        row: {
                                            backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                        },
                                        description: {
                                            color: props.theme === "dark" ? "white" : "black"
                                        },
                                    }}
                                    listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme} />}
                                    listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme} />}
                                    textInputProps={{
                                        placeholder: "Enter New Location Address",
                                        placeholderTextColor: "rgb(156 163 175)"
                                    }}
                                    onPress={(data, details = null) => {
                                        setLocationAddress({
                                            ...locationAddress,
                                            location: details.geometry.location,
                                            description: data.description
                                        })
                                    }}
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
                        <View className={`w-[90%] h-[23%] rounded-[20px] ${props.theme === "dark" ? "border-[#222831] bg-dark-secondary" : "bg-white border-gray-200"} shadow border-[0.5px] flex flex-row justify-evenly items-center`}>
                            <TouchableOpacity className={`bg-red-700 shadow-sm w-[40%] h-[65%] rounded-[50px] flex justify-center items-center`} onPress={() => {
                                navigation.goBack();
                            }}>
                                <Text style={{fontSize: fontSize * 0.85}} className="font-bold tracking-tight text-white">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={locationAddress["description"].length < 1 ? true : false} className={`bg-[#186F65] shadow-sm w-[40%] h-[65%] rounded-[50px] flex justify-center items-center ${locationAddress["description"].length < 1 ? "opacity-40" : "opacity-100"}`} onPress={handleSaveLocationAddress}>
                                <Text style={{fontSize: fontSize * 0.85}} className="font-bold tracking-tight text-white">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default EditLocation;