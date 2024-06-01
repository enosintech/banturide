import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, PixelRatio, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Dimensions } from 'react-native'

import LoadingBlur from '../../components/atoms/LoadingBlur';

const LoginVerifyOtp = (props) => {

  const height = Dimensions.get('window').height;
  const width = Dimensions.get("window").width;

  const fontScale = PixelRatio.getFontScale();

  const getFontSize = size => size / fontScale;

  const [error, setError ] = useState("")
  const [errorVisible, setErrorVisible] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ otp, setOtp ] = useState({
    value1: "",
    value2: "",
    value3: "",
    value4: "",
    value5: "",
    value6: "",
  });

  const firstAgainTextInputRef = useRef(null)
  const secondAgainTextInputRef = useRef(null);
  const thirdAgainTextInputRef = useRef(null);
  const fourthAgainTextInputRef = useRef(null);
  const fifthAgainTextInputRef = useRef(null);
  const sixthAgainTextInputRef = useRef(null);

  return (
    <KeyboardAvoidingView
        className="flex-1 justify-end flex-col"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-100}
    >
        <TouchableWithoutFeedback className="w-full h-full" onPress={Keyboard.dismiss}>
            <View style={{height: height}} className={`w-full items-center justify-center relative`}>
                <LoadingBlur loading={loading} />
                <View className={`w-[95%] h-[70%] flex items-center`}>
                    <Text style={{fontSize: getFontSize(20)}} className={`font-extrabold tracking-tight`}>Verify Email Address</Text>
                    <Text style={{fontSize: getFontSize(14)}} className={`text-center px-10 mt-3 font-medium tracking-tight`}>Please verify your email address using the 6 digit One time pin (OTP) we sent to your email address. You will not be able to sign until you verify your email</Text>
                    <View className={`w-[60%] h-[15%] ${props.theme === "dark" ? "" : "border-gray-500"} ${errorVisible ? "border-red-600" : ""} mt-10 border-[0.3px] rounded-[20px] flex flex-col items-center justify-center`}>
                        <Text style={{fontSize: getFontSize(14)}} className={`${errorVisible ? "text-red-600" : "text-gray-700"} font-thin tracking-tight`}>OTP must be 6 digits</Text>
                    </View>
                    <View className={`w-full h-[50%] rounded-[20px] ${props.theme === "dark" ? "" : "bg-white"} flex items-center justify-evenly mt-10`}>
                        <View className={`w-full h-[60%] flex flex-row items-center justify-evenly`}>
                            <TextInput ref={(ref) => (firstAgainTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[38%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value1: x})
                                }
                                if(x.length >= 1){
                                    secondAgainTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (secondAgainTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[38%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value2: x})
                                }
                                if(x.length >= 1){
                                    thirdAgainTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    firstAgainTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (thirdAgainTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[38%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value3: x})
                                }
                                if(x.length >= 1){
                                    fourthAgainTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    secondAgainTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (fourthAgainTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[38%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value4: x})
                                }
                                if(x.length >= 1){
                                    fifthAgainTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    thirdAgainTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (fifthAgainTextInputRef.current = ref)} blurOnSubmit={false} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[38%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value5: x})
                                }
                                if(x.length >= 1){
                                    sixthAgainTextInputRef?.current?.focus()
                                }
                                if(x.length <= 0){
                                    fourthAgainTextInputRef?.current?.focus()
                                }
                            }}/>
                            <TextInput ref={(ref) => (sixthAgainTextInputRef.current = ref)} blurOnSubmit={true} maxLength={1} keyboardType='numeric' className={`w-[14%] h-[38%] shadow ${props.theme === "dark" ? "" : "bg-white"} rounded-[10px] outline-none text-5xl text-center pt-4`} onChangeText={(x) => {
                                if(!isNaN(x)){
                                    setOtp({...otp, value6: x})
                                }
                                if(x.length <= 0){
                                    fifthAgainTextInputRef?.current?.focus()
                                }
                            }} />
                        </View>
                        <View className={`w-full h-[40%] flex items-center justify-center`}>
                            <View className={`w-[95%] h-[80%] rounded-[20px] bg-white shadow flex items-center justify-center`}>
                                <TouchableOpacity style={{width: width * 0.77}} className={`bg-[#186f65] p-4 flex items-center rounded-[25px]`} onPress={() => {
                                  console.log("done")
                                }}>
                                    <Text style={{fontSize: getFontSize(20)}} className={`text-white font-bold tracking-tight`}>Verify My Email</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginVerifyOtp;