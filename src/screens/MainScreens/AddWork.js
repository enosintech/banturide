import {Text, View, TextInput, TouchableOpacity, PixelRatio } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRef, useState } from "react";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";

const AddWork = (props) => {
    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

    const navigation = useNavigation();

    const workAddressRef = useRef(null);

    const [ workAddress, setWorkAddress ] = useState({});

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
        <View className="flex-1 flex-col justify-end">
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
                                    fontSize: 18,
                                    height: "100%",
                                    width: "100%",
                                    fontWeight: "500",
                                    color: props.theme === "dark" ? "white" : "black",
                                    backgroundColor: "transparent"
                                },
                                listView: {
                                    position : "absolute",
                                    zIndex: 100,
                                    elevation: 100,
                                    top: 60,
                                    backgroundColor: "white",
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    height: 100    
                                }
                            }}
                            textInputProps={{
                                placeholder: "Enter Work Address",
                                placeholderTextColor: "gray"
                            }}
                            onPress={(data, details = null) => {
                                setWorkAddress({
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
                <View className={`w-[90%] h-[30%] rounded-[20px] ${props.theme === "dark" ? "border-[#222831] bg-[#222831]" : "bg-white border-gray-200"} shadow border-[0.5px] justify-center items-center`}>
                    <TouchableOpacity className="bg-[#186F65] shadow-lg w-[90%] h-[65%] rounded-[25px] flex justify-center items-center" onPress={() => {
                        navigation.goBack()
                    }}>
                        <Text style={{fontSize: getFontSize(18)}} className="font-bold tracking-tight text-white">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddWork;