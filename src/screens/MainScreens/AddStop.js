import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useCallback } from "react"; 
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Octicons from "@expo/vector-icons/Octicons";

import { selectBooking, selectFavoritesData, selectToggle, setPassThrough } from '../../../slices/navSlice';

import ListLoadingComponent from '../../components/atoms/ListLoadingComponent';

import ShortModalNavBar from '../../components/atoms/ShortModalNavBar';

import { GOOGLE_API_KEY } from "@env";

const { width } = Dimensions.get("window");

const AddStop = (props) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";
    const height = Dimensions.get("window").height;

    const booking = useSelector(selectBooking);
    const toggle = useSelector(selectToggle);
    const favoritesData = useSelector(selectFavoritesData);

    const fontSize = width * 0.05;

    const { goBack } = useNavigation();
    const translateY = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        {
             useNativeDriver: true, 
        },
    )

    const onHandlerStateChange = useCallback(
        ({nativeEvent}) => {
            if (nativeEvent.state === 5) { // 5 is the value for `END` state
                if (nativeEvent.translationY > 150) { // Adjust threshold as needed
                    goBack(); // Close the modal
                } else {
                    Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    }).start();
                }
            }
        },
        [goBack, translateY]
    )

    const translateYClamped = translateY.interpolate({
        inputRange: [0, 9999],  // Large range to allow normal dragging
        outputRange: [0, 9999], // Mirrors input but clamps the lower bound to 0
        extrapolate: 'clamp',
    });

    const predefinedPlaces = favoritesData.map((place) => ({
        description: place.type === 'home' ? "Home" : place.type === 'work' ? "Work" : place.address.description,
        geometry: { location: place.address.location },
    }));

    const sortedPredefinedPlaces = [...predefinedPlaces].sort((a, b) => {
        if (a.description === "Home") return -1;
        if (b.description === "Home") return 1;
        if (a.description === "Work") return b.description === "Home" ? 1 : -1;
        if (b.description === "Work") return a.description === "Home" ? -1 : 1;
        return 0;
    });

  return (
    <KeyboardAvoidingView
        style={containerStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={10}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
            >
                <Animated.View style={{height: 0.3 * height, transform : [{ translateY: translateYClamped}]}} className={`w-full ${props.theme === "dark" ? "bg-dark-middle" : "bg-white"} rounded-t-[40px] flex px-3`}>
                    <View className="w-full h-[100px] flex flex-row items-center justify-center relative">
                        <View className={`w-full h-[20%] absolute top-0 left-0 flex items-center justify-center`}>
                            <ShortModalNavBar theme={props.theme} />
                        </View>
                        <Text style={{fontSize: fontSize * 1.6}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tight`}>
                            Add Stop
                        </Text>
                    </View>
                    <View className="w-full h-0 border-[0.5px] border-gray-400"></View>
                    <View className={`flex-row items-center justify-center w-full h-[65px] shadow-2xl relative z-50 flex `}>
                        <View className={`w-[15%] items-center h-full justify-center`}>
                            <TouchableOpacity className={`w-8 h-8 rounded-full shadow border rotate-90 items-center justify-center ${props.theme === "dark" ? "bg-[#5a626e] border-gray-700" : "bg-white border-gray-100"}`}>
                                <Octicons name="arrow-switch" size={fontSize * 0.95} color={props.theme === "dark" ? "white" : "black"} />
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
                                    fontSize: fontSize * 0.85,
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
                                    top: 56,
                                    backgroundColor: props.theme === "dark" ? "#222831" : "white",  
                                },
                                description: {
                                    color: props.theme === "dark" ? "white" : "black"
                                },
                                loader: {
                                    height: "100%",
                                    width: "100%"
                                },
                                row: {
                                    backgroundColor: props.theme === "dark" ? "#222831" : "white",
                                },
                            }}
                            textInputProps={{
                                placeholder: toggle === "ride" ? "Going Through?" : "Pick-Up/ Drop-Off",
                                placeholderTextColor: "gray",
                            }}
                            predefinedPlaces={sortedPredefinedPlaces}
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
                            debounce={100}
                            listEmptyComponent={<ListLoadingComponent element={"Empty"} theme={props.theme} />}
                            listLoaderComponent={<ListLoadingComponent element={"loading"} theme={props.theme}/>}
                        />
                    </View>
                </Animated.View>
            </PanGestureHandler>
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