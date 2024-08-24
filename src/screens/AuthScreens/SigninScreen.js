import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";

import { selectForgotPasswordTriggered, selectGlobalAuthLoading, selectGlobalLoginError, selectIsSignedIn, setForgotPasswordTriggered, setGlobalAuthLoading, setGlobalLoginError, setIsSignedIn } from "../../../slices/authSlice";

import BackButton from "../../components/atoms/BackButton";
import LoadingBlur from "../../components/atoms/LoadingBlur";

const { width } = Dimensions.get("window");

const SigninScreen = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const routes = useRoute();

    const fontSize = width * 0.05;
    
    const { resetMessage } = routes?.params ? routes.params : "";

    const [visible, setVisible] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [errorVisible, setErrorVisible ] = useState(false);
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const height = Dimensions.get("window").height;

    const isSignedIn = useSelector(selectIsSignedIn);
    const forgotPasswordTriggered = useSelector(selectForgotPasswordTriggered);
    const globalLoginError = useSelector(selectGlobalLoginError);
    const globalAuthLoading = useSelector(selectGlobalAuthLoading);

    const handleEmailPasswordSignIn = async () => {
        Keyboard.dismiss()
        dispatch(setGlobalAuthLoading(true))

        if(email === "" || password === ""){
            dispatch(setGlobalAuthLoading(false))
            setErrorVisible(true);
            setError("No Email or Password Entered")
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000);
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;

        if (!emailRegex.test(email)) {
            dispatch(setGlobalAuthLoading(false))
            setErrorVisible(true);
            setError("Please enter a valid email address");
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000);
            return;
        }

        await fetch("https://banturide-api.onrender.com/auth/signin", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then( async data => {

            if(data.success === false) {
                dispatch(setGlobalAuthLoading(false))
                setErrorVisible(true)
                setError(data.message)
                setTimeout(() => {
                    setErrorVisible(false)
                }, 4000)
            } else {
                await SecureStore.setItemAsync("tokens", JSON.stringify(data.userCredential._tokenResponse)).then(() => {
                    console.log("reached")
                    dispatch(setIsSignedIn(!isSignedIn))
                })
            }

        })
        .catch((err) => {
            dispatch(setGlobalAuthLoading(false))
            setErrorVisible(true)
            setError(err)
            setTimeout(() => {
                setErrorVisible(false)
            }, 4000)
        })
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch(setForgotPasswordTriggered(false))
        }, 5000)
    }, [forgotPasswordTriggered])

    useEffect(() => {
        setTimeout(() => {
            dispatch(setGlobalLoginError(null))
        }, 5000)
    }, [globalLoginError])

    return (
        <KeyboardAvoidingView 
            className="flex-1 justify-end flex-col"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-280}
            >
            <TouchableWithoutFeedback className={'w-full h-full'} onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={[{height: height}]} className={`${props.theme === "light" ? "" : props.theme === "dark" ? "bg-[#222831]" : "bg-white"} w-full flex-col relative items-center`}>
                    <LoadingBlur loading={globalAuthLoading} theme={props.theme}/>

                    {forgotPasswordTriggered && resetMessage &&
                        <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                            <View className={`w-fit px-4 h-[90%] bg-black rounded-[50px] flex items-center justify-center`}>
                                <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-light text-center tracking-tight">{resetMessage}</Text>
                            </View>
                        </View>
                    }

                    <View className="w-full h-[10%]">
                        <View className="w-full pl-6 pt-2">
                            <BackButton theme={props.theme} value="Back" handlePress={() => {
                                navigation.navigate("Welcome");
                            }}/>
                        </View>
                    </View>
                    <View className="mt-5"></View>
                    <View className={` h-[40%] w-full flex items-center`}>
                        <View className="h-[25%]">
                            <Text style={{fontSize: fontSize * 1.4}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Sign in with your Email</Text>
                        </View>
                        <View className={`h-[55%] ${props.theme === "dark" ? "border-gray-900 w-full" : "bg-white w-[90%]"} rounded-[40px] flex items-center justify-center mt-5 shadow-sm`}>
                            <TextInput
                                className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[30%] w-[90%] font-semibold tracking-tight border-[0.25px] p-2 px-4 border-solid rounded-[25px]`} 
                                placeholder="Email"
                                style={{ fontSize: fontSize * 0.8}}
                                placeholderTextColor="rgb(156 163 175)"
                                onChangeText={(x) => setEmail(x)}
                                keyboardType={"email-address"}
                                autoComplete="email"
                                autoCapitalize="none"
                                autoCorrect={false}
                                accessibilityLabel="Email Input"
                                accessibilityHint="Enter your Email"
                            />
                            <View className={`h-[30%] mt-5 ${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} w-[90%] border-[0.25px] border-solid rounded-[25px] flex-row items-center p-2 px-4`}>
                                <TextInput
                                    className={`w-[90%] h-full ${props.theme === "dark" ? "text-white" : " text-black"} font-semibold tracking-tight`}
                                    placeholder="Password"
                                    style={{fontSize: fontSize * 0.8}}
                                    placeholderTextColor="rgb(156 163 175)"
                                    secureTextEntry={!visible}
                                    onChangeText={(x) => setPassword(x)}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    accessibilityLabel="Password Input"
                                    accessibilityHint="Enter your password"
                                />
                                <TouchableOpacity onPress={() => {
                                    setVisible(!visible)
                                }}>
                                    <MaterialIcons name={`${visible === true ? "visibility": "visibility-off"}`} size={fontSize * 1.2} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="w-full h-fit mt-5 flex flex-row items-center justify-end">
                            <TouchableOpacity className="text-nowrap max-w-[40%] w-fit pr-7" onPress={() => {
                                    navigation.navigate("Forgot")
                                }}>
                                    <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-right w-fit font-medium tracking-tight`}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className={`h-[30%] w-[90%] mt-4 rounded-[40px] py-5 flex items-center shadow-sm justify-evenly ${props.theme === "dark" ? "bg-[#353d4a]" : "bg-white"}`}>
                        { globalLoginError && 
                            <View className="w-full h-fit mt-2 flex items-center justify-center">
                                <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-red-500 font-semibold tracking-tight`}>{globalLoginError}</Text>
                            </View>
                        }

                        {errorVisible && 
                            <View className="w-full h-fit mt-2 flex items-center justify-center">
                                <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-red-500 font-semibold tracking-tight`}>{error}</Text>
                            </View>
                        }
                        <TouchableOpacity className="bg-[#186F65] shadow-sm w-[85%] h-[40%] rounded-[50px] flex justify-center items-center" onPress={handleEmailPasswordSignIn}>
                            <Text style={{fontSize: fontSize * 1.1}} className="text-white font-bold tracking-tight">Sign in</Text>
                        </TouchableOpacity>
                        <View className="mt-3 flex-row items-center justify-center">
                            <Text style={{fontSize: fontSize * 0.7}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tight`}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Signup")
                            }}>
                                <Text style={{fontSize: fontSize * 0.7}} className="text-[#186F65] font-extrabold tracking-tight">Sign up</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SigninScreen;