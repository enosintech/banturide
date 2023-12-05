import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screens/MainScreens/ProfileScreen";
import HistoryScreen from "../screens/MainScreens/HistoryScreen";
import ComplainScreen from "../screens/MainScreens/ComplainScreen";
import ReferralScreen from "../screens/MainScreens/ReferralScreen";
import AboutScreen from "../screens/MainScreens/AboutScreen";
import SettingsScreen from "../screens/MainScreens/SettingsScreen";
import SupportScreen from "../screens/MainScreens/SupportScreen";
import BurgerMenu from "../screens/MainScreens/BurgerMenu";
import EditProfile from "../screens/MainScreens/EditProfile";
import PaymentMethods from "../screens/MainScreens/PaymentMethods";

const Stack = createNativeStackNavigator();

const ProfileNavigator = (props) => {
    return(
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Group>
                <Stack.Screen name="Profile" options={{headerShown: false}}>
                    {() => <ProfileScreen theme={props.theme} />}
                </Stack.Screen>
                <Stack.Screen name="EditProfile" options={{headerShown: false}}>
                    {() => <EditProfile theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "fullScreenModal"}}>
            <Stack.Screen name="History" options={{headerShown: false}}>
                    {() => <HistoryScreen theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Complain" options={{headerShown: false}}>
                    {() => <ComplainScreen theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Referral" options={{headerShown: false}}>
                    {() => <ReferralScreen theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="About" options={{headerShown: false}}>
                    {() => <AboutScreen theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Settings" options={{headerShown: false}}>
                    {() => <SettingsScreen theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Support" options={{headerShown: false}}>
                    {() => <SupportScreen theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal", contentStyle: {
                backgroundColor: "transparent"
            }}}>
                <Stack.Screen name="BurgerMenu" options={{headerShown: false}}>
                    {() => <BurgerMenu theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                </Stack.Screen>
                <Stack.Screen name="paymentmethod" options={{headerShown: false}}>
                    {() => <PaymentMethods theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default ProfileNavigator;