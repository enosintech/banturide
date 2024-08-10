import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../hooks/useAuth";

import TabNavigator from "./TabNavigator";

import { WebSocketProvider } from "../components/atoms/WebSocket";
import LoadingBlur from "../components/atoms/LoadingBlur";

import WelcomeScreen from "../screens/AuthScreens/WelcomeScreen";
import SignupScreen from "../screens/AuthScreens/SignupScreen";
import SigninScreen from "../screens/AuthScreens/SigninScreen";
import ForgotPassword from "../screens/AuthScreens/ForgotPassword";
import TermsAndConditions from "../screens/AuthScreens/TermsAndConditions";
import SetPassword from "../screens/AuthScreens/SetPassword";
import VerifyOtp from "../screens/AuthScreens/VerifyOtp";
import LoginVerifyOtp from "../screens/AuthScreens/LoginVerifyOtp";

const Stack = createNativeStackNavigator();

const AuthNavigator = (props) => {

    const { user } = useAuth();

    if(user === true){
        return (
            <WebSocketProvider>
                <Stack.Navigator initialRouteName="Tab">
                    <Stack.Screen name="Tab" options={{headerShown: false}}>
                        {() => <TabNavigator handleLayout={props.handleLayout} theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </WebSocketProvider>
        )
    } else if(user === false) {
        return (
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="Welcome" options={{headerShown: false}}>
                    {() => <WelcomeScreen handleLayout={props.handleLayout} theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Signin" options={{headerShown: false}}>
                    {() => <SigninScreen theme={props.theme} />}
                </Stack.Screen>
                <Stack.Screen name="Signup" options={{headerShown: false}}>
                    {() => <SignupScreen theme={props.theme} />}
                </Stack.Screen>
                <Stack.Screen name="setpassword" options={{headerShown: false}}>
                    {() => <SetPassword theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="verifyotp" options={{headerShown: false}}>
                    {() => <VerifyOtp theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Group screenOptions={{presentation: "modal"}}>
                    <Stack.Screen name="Forgot" options={{headerShown: false}}>
                        {() => <ForgotPassword theme={props.theme}/>}
                    </Stack.Screen>
                    <Stack.Screen name="TnCs" options={{headerShown: false}}>
                        {() => <TermsAndConditions theme={props.theme}/>}
                    </Stack.Screen>
                    <Stack.Screen name="loginVerifyOtp" options={{headerShown: false}}>
                        {() => <LoginVerifyOtp theme={props.theme} />}
                    </Stack.Screen>
                </Stack.Group>
            </Stack.Navigator>
        )
    } else if(user === undefined) {
        return (
            <LoadingBlur loading={true} />
        )
    }
}

export default AuthNavigator;

