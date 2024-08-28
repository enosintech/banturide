import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../hooks/useAuth";

import TabNavigator from "./TabNavigator";

import { SocketProvider } from "../components/atoms/Socket";
import LoadingBlur from "../components/atoms/LoadingBlur";

import WelcomeScreen from "../screens/AuthScreens/WelcomeScreen";
import SignupScreen from "../screens/AuthScreens/SignupScreen";
import SigninScreen from "../screens/AuthScreens/SigninScreen";
import ForgotPassword from "../screens/AuthScreens/ForgotPassword";
import TermsAndConditions from "../screens/AuthScreens/TermsAndConditions";
import SetPassword from "../screens/AuthScreens/SetPassword";
import SearchModal from "../screens/MainScreens/SearchModal";
import RequestScreen from "../screens/MainScreens/RequestScreen";
import BookNavigator from "./BookNavigator";
import RequestNavigator from "./RequestNavigator";

const Stack = createStackNavigator();

const AuthNavigator = (props) => {

    const { user } = useAuth();

    if(user === true){
        return (
            <SocketProvider>
                <Stack.Navigator initialRouteName="Tab">
                    <Stack.Screen name="Tab" options={{headerShown: false}}>
                        {() => <TabNavigator handleLayout={props.handleLayout} theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                    </Stack.Screen>
                    <Stack.Screen name="BookNavigator" options={{headerShown: false}}>
                        {() => <BookNavigator theme={props.theme} />}
                    </Stack.Screen>
                    <Stack.Group screenOptions={{
                        presentation: "fullScreenModal", 
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                        cardStyleInterpolator: ({ current, layouts }) => {
                            return {
                                cardStyle: {
                                transform: [
                                    {
                                    translateY: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.height, 0],
                                    }),
                                    },
                                ],
                                },
                            };
                        },
                        }}
                    >
                        <Stack.Screen name="RequestNavigator" options={{headerShown: false}}>
                            {() => <RequestNavigator theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="requests" options={{headerShown: false}}>
                            {() => <RequestScreen theme={props.theme}/>}
                        </Stack.Screen>
                    </Stack.Group>
                    <Stack.Group screenOptions={{ presentation: "modal", gestureEnabled: false, detachPreviousScreen: false, cardStyle: {backgroundColor: "transparent"}, ...(Platform.OS === 'android' && {
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    })  }}>
                        <Stack.Screen name="Search" options={{headerShown: false }}>
                            {() => <SearchModal  theme={props.theme} />}
                        </Stack.Screen>
                    </Stack.Group>
                </Stack.Navigator>
            </SocketProvider>
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
                <Stack.Group screenOptions={{presentation: "modal"}}>
                    <Stack.Screen name="Forgot" options={{headerShown: false}}>
                        {() => <ForgotPassword theme={props.theme}/>}
                    </Stack.Screen>
                    <Stack.Screen name="TnCs" options={{headerShown: false}}>
                        {() => <TermsAndConditions theme={props.theme}/>}
                    </Stack.Screen>
                </Stack.Group>
            </Stack.Navigator>
        )
    } else if(user === undefined) {
        return (
            <Stack.Navigator initialRouteName="loading">
                <Stack.Screen name="loading" options={{headerShown: false}}>
                    {() => <LoadingBlur theme={props.theme} loading={true} />}
                </Stack.Screen>
            </Stack.Navigator>
        )
    }
}

export default AuthNavigator;

