import { useNavigation } from "@react-navigation/native";
import {Text, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { GOOGLE_API_KEY } from "@env";

import ShortModalNavBar from "../../components/atoms/ShortModalNavBar";
import { setOrigin, setDestination } from "../../../slices/navSlice";
import { selectDestination, selectOrigin } from "../../../slices/navSlice";

const SearchModal = (props) => {

    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);

    const navigation = useNavigation();

    const dispatch = useDispatch()

    let greeting;

    const Hour = new Date().getHours();

    if (Hour < 12){
        greeting = "Good Morning"
    } else if(Hour < 16){
        greeting = "Good Afternoon"
    } else if(Hour < 21) {
        greeting = "Good Evening"
    } else {
        greeting = "Be Safe at Night"
    }

    return(
        <KeyboardAvoidingView
            style={containerStyles.container}
            behavior="padding"  
            keyboardVerticalOffset={30}
        >
        <TouchableWithoutFeedback className="flex-1" onPress={Keyboard.dismiss}>
            <View className={`h-[40%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} items-center rounded-t-2xl`}>
                <View className={`h-[3%] w-full items-center justify-center border-b-[0.25px]`}>
                    <ShortModalNavBar />
                </View>
                <View className={`h-[15%] w-full border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"} items-center justify-center`}>
                    <Text style={{fontFamily: 'os-b'}} className={`text-xl ${props.theme === "dark" ? "text-white" : "text-black"}`}>{greeting + " " + "Enos"}</Text>
                </View>
                <View className={`flex-row items-center justify-center mt-5 w-[85%] h-[15%] shadow-2xl pr-2 relative z-50`}>
                    <View className={`w-[10%] items-center h-full justify-center mr-2`}>
                        <MaterialIcons name="trip-origin" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
                    </View>
                    <GooglePlacesAutocomplete 
                        styles={{
                            textInput: {
                                fontSize: 18,
                                height: 55,
                                fontWeight: "bold"
                            },
                            listView: {
                                position : "absolute",
                                zIndex: 100,
                                elevation: 100,
                                top: 56   
                            }
                        }}
                        textInputProps={{
                            placeholder: "Where From?",
                            placeholderTextColor: "gray",
                        }}
                        onPress={(data, details = null) => {
                            dispatch(setOrigin({
                                location: details.geometry.location,
                                description: data.description
                            }))

                            dispatch(setDestination(null))
                        }}
                        query={{
                            key: "AIzaSyDCK1kGQBTjZ3-KWP5I7Q4AQQ3DCTEv060",
                            language: "en"
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        minLength={2}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={200}
                    />
                </View>
                <View className={`flex-row items-center justify-center mt-5 w-[85%] h-[15%] shadow-2xl pr-2 relative z-50`}>
                    <View className={`w-[10%] items-center h-full justify-center mr-2`}>
                        <FontAwesome name="flag-checkered" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
                    </View>
                    <GooglePlacesAutocomplete 
                        styles={{
                            textInput: {
                                fontSize: 18,
                                height: 55,
                                fontWeight: "bold"
                            },
                            listView: {
                                position : "absolute",
                                zIndex: 100,
                                elevation: 100,
                                top: 56   
                            }
                        }}
                        textInputProps={{
                            placeholder: "Where To?",
                            placeholderTextColor: "gray",
                        }}
                        query={{
                            key: "AIzaSyDCK1kGQBTjZ3-KWP5I7Q4AQQ3DCTEv060",
                            language: "en"
                        }}
                        onPress={(data, details = null) => {
                            dispatch(setDestination({
                                location: details.geometry.location,
                                description: data.description
                            }))
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        minLength={2}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={200}
                    />
                </View>
                <TouchableOpacity className={`w-[90%] h-[15%] rounded-2xl shadow-2xl mt-3 bg-[#186f65] ${!destination ? "opacity-25" : "opacity-100"} items-center justify-center`} disabled={!destination} onPress={() => {
                    navigation.goBack()
                    navigation.navigate("BookNavigator")
                }}>
                    <Text style={{fontFamily: "os-sb"}} className={`text-xl text-white`}>Confirm</Text>
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SearchModal;

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "column"
    }
})