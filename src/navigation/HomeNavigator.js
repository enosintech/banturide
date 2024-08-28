import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/MainScreens/HomeScreen";
import NotificationsScreen from "../screens/MainScreens/NotificationsScreen";

const Stack = createStackNavigator();

const HomeNavigator = (props) => {

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Group>
                <Stack.Screen name="Home" options={{headerShown: false}}>
                    {() => <HomeScreen initialRegion={props.initialRegion} setInitialRegion={props.setInitialRegion} handleLayout={props.handleLayout} theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Notifications" options={{headerShown: false}}>
                    {() => <NotificationsScreen theme={props.theme} />}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default HomeNavigator;