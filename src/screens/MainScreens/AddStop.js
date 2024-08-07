import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, PixelRatio, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Octicons from "@expo/vector-icons/Octicons";

import { GOOGLE_API_KEY } from "@env";
import { useDispatch, useSelector } from 'react-redux';
import { selectBooking, selectToggle, setPassThrough } from '../../../slices/navSlice';
import { useNavigation } from '@react-navigation/native';

const AddStop = (props) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";
    const height = Dimensions.get("window").height;

    const booking = useSelector(selectBooking);
    const toggle = useSelector(selectToggle);

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

  return (
    <KeyboardAvoidingView
        style={containerStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={10}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <View style={{height: 0.3 * height}} className={`w-full bg-white rounded-t-[20px] flex px-3`}>
                <View className="w-full h-[100px] flex flex-row items-center">
                    <Text style={{fontSize: getFontSize(30)}} className="font-bold tracking-tight">
                        Add Stop
                    </Text>
                </View>
                <View className="w-full h-0 border-[0.5px] border-gray-400"></View>
                <View className={`flex-row items-center justify-center w-full h-[65px] shadow-2xl relative z-50 flex `}>
                    <View className={`w-[15%] items-center h-full justify-center`}>
                        <TouchableOpacity className={`w-8 h-8 rounded-full shadow border items-center justify-center ${props.theme === "dark" ? "bg-[#5a626e] border-gray-700" : "bg-white border-gray-100"}`}>
                            <Octicons className="rotate-[90deg]" name="arrow-switch" size={getFontSize(19)} color={props.theme === "dark" ? "white" : "black"} />
                        </TouchableOpacity>
                    </View>
                    <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-white" : "border-gray-800"}`}></View>
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
                                fontSize: 18,
                                height: "100%",
                                width: "100%",
                                fontWeight: "bold",
                                color: props.theme === "dark" ? "white" : "black",
                                backgroundColor: "transparent"
                            },
                            listView: {
                                position : "absolute",
                                zIndex: 100,
                                elevation: 100,
                                top: 56   
                            }
                        }}
                        textInputProps={{
                            placeholder: toggle === "ride" ? "Going Through?" : "Pick-Up/ Drop-Off",
                            placeholderTextColor: "gray",
                        }}
                        query={{
                            key: api,
                            language: "en",
                            components: "country:zm"
                        }}
                        onPress={(data, details = null) => {
                            dispatch(setPassThrough({
                                location: details.geometry.location,
                                description: data.description
                            }))

                            if(booking){
                                navigation.navigate("driver")
                            } else {
                                navigation.navigate("confirmscreen")
                            }
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        minLength={2}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={200}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AddStop;

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "column",
    },
})