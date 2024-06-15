import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FavouriteScreen from "../screens/MainScreens/FavouriteScreen";
import AddHome from "../screens/MainScreens/AddHome";
import AddLocation from "../screens/MainScreens/AddLocation";
import AddWork from "../screens/MainScreens/AddWork";
import EditHome from "../screens/MainScreens/EditHome";
import EditWork from "../screens/MainScreens/EditWork";
import EditLocation from "../screens/MainScreens/EditLocation";

const Stack = createNativeStackNavigator();

const FavoriteNavigator = (props) => {
    return (
        <Stack.Navigator initialRouteName="Favorite">
            <Stack.Group>
                <Stack.Screen name="Favorite" options={{headerShown: false}}>
                    {() => <FavouriteScreen theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal", contentStyle: {
                backgroundColor: "transparent"
            }}}>
                <Stack.Screen name="addhome" options={{headerShown: false}}>
                    {() => <AddHome theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="addwork" options={{headerShown: false}}>
                    {() => <AddWork theme={props.theme}/>}
                </Stack.Screen>
                <Stack.Screen name="addlocation" options={{headerShown: false}}>
                    {() => <AddLocation theme={props.theme}/>}
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
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default FavoriteNavigator;