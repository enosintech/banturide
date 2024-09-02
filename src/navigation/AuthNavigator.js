import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { useState } from "react";

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
import BurgerMenu from "../screens/MainScreens/BurgerMenu";
import ChangeName from "../screens/MainScreens/ChangeName";
import AddLocation from "../screens/MainScreens/AddLocation";
import AddHome from "../screens/MainScreens/AddHome";
import AddWork from "../screens/MainScreens/AddWork";
import EditHome from "../screens/MainScreens/EditHome";
import EditWork from "../screens/MainScreens/EditWork";
import EditLocation from "../screens/MainScreens/EditLocation";
import TogglePayment from "../screens/MainScreens/TogglePayment";
import AddStop from "../screens/MainScreens/AddStop";

const Stack = createStackNavigator();

const AuthNavigator = (props) => {

    const { user } = useAuth();

    const [initialRegion, setInitialRegion ] = useState(null);

    if(user === true){
        return (
            <SocketProvider>
                <Stack.Navigator initialRouteName="Tab">
                    <Stack.Screen name="Tab" options={{headerShown: false}}>
                        {() => <TabNavigator initialRegion={initialRegion} setInitialRegion={setInitialRegion} handleLayout={props.handleLayout} theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                    </Stack.Screen>
                    <Stack.Screen name="BookNavigator" options={{headerShown: false}}>
                        {() => <BookNavigator initialRegion={initialRegion} theme={props.theme} />}
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
                        <Stack.Screen name="BurgerMenu" options={{headerShown: false}}>
                            {() => <BurgerMenu theme={props.theme} />}
                        </Stack.Screen>
                        <Stack.Screen name="changeName" options={{headerShown: false}}>
                            {() => <ChangeName theme={props.theme} />}
                        </Stack.Screen>
                        <Stack.Screen name="addlocation" options={{headerShown: false}}>
                            {() => <AddLocation theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="addhome" options={{headerShown: false}}>
                            {() => <AddHome theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="addwork" options={{headerShown: false}}>
                            {() => <AddWork theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="edithome" options={{headerShown: false}}>
                            {() => <EditHome theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="editwork" options={{headerShown: false}}>
                            {() => <EditWork theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="editlocation" options={{headerShown: false}}>
                            {() => <EditLocation theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="togglePayment" options={{headerShown: false }}>
                            {() => <TogglePayment theme={props.theme}/>}
                        </Stack.Screen>
                        <Stack.Screen name="addStop" options={{headerShown: false }}>
                            {() => <AddStop theme={props.theme}/>}
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

