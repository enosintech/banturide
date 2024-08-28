import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/MainScreens/ProfileScreen";
import AboutScreen from "../screens/MainScreens/AboutScreen";
import BurgerMenu from "../screens/MainScreens/BurgerMenu";
import EditProfile from "../screens/MainScreens/EditProfile";
import ChangeName from "../screens/MainScreens/ChangeName";

const Stack = createStackNavigator();

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
                <Stack.Screen name="About" options={{headerShown: false}}>
                    {() => <AboutScreen theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal", contentStyle: {
                backgroundColor: "transparent"
            }}}>
                <Stack.Screen name="BurgerMenu" options={{headerShown: false}}>
                    {() => <BurgerMenu theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                </Stack.Screen>
                <Stack.Screen name="changeName" options={{headerShown: false}}>
                    {() => <ChangeName theme={props.theme} />}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default ProfileNavigator;