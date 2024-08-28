import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";

import HomeScreen from "../screens/MainScreens/HomeScreen";
import NotificationsScreen from "../screens/MainScreens/NotificationsScreen";
import SearchModal from "../screens/MainScreens/SearchModal";
import BookNavigator from "./BookNavigator";
import RequestNavigator from "../navigation/RequestNavigator";
import RequestScreen from "../screens/MainScreens/RequestScreen";

const Stack = createStackNavigator();

const HomeNavigator = (props) => {
    
    const [initialRegion, setInitialRegion ] = useState(null);

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Group>
                <Stack.Screen name="Home" options={{headerShown: false}}>
                    {() => <HomeScreen initialRegion={initialRegion} setInitialRegion={setInitialRegion} handleLayout={props.handleLayout} theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="Notifications" options={{headerShown: false}}>
                    {() => <NotificationsScreen theme={props.theme} />}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default HomeNavigator;