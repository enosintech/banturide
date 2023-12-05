import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

import HomeScreen from "../screens/MainScreens/HomeScreen";
import NotificationsScreen from "../screens/MainScreens/NotificationsScreen";
import SearchModal from "../screens/MainScreens/SearchModal";
import BookNavigator from "./BookNavigator";
import RequestNavigator from "../navigation/RequestNavigator";

const Stack = createNativeStackNavigator();

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
            <Stack.Group screenOptions={{presentation: "fullScreenModal"}}>
                <Stack.Screen name="BookNavigator" options={{headerShown: false}}>
                    {() => <BookNavigator initialRegion={initialRegion} theme={props.theme} />}
                </Stack.Screen>
                <Stack.Screen name="RequestNavigator" options={{headerShown: false}}>
                    {() => <RequestNavigator theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal", contentStyle: {
                backgroundColor: "transparent",
            } }}>
                <Stack.Screen name="Search" options={{headerShown: false }}>
                    {() => <SearchModal theme={props.theme} />}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default HomeNavigator;