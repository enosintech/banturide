import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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

  return (
    <KeyboardAvoidingView
        style={containerStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={10}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <View style={{height: 0.3 * height}} className={`w-full bg-white rounded-t-[20px] flex`}>
                <GooglePlacesAutocomplete 
                    styles={{
                        container: {
                            width: "100%",
                            height: "100%",
                        },
                        textInputContainer: {
                            height: "100%",
                            width: "70%",
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
                        language: "en"
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