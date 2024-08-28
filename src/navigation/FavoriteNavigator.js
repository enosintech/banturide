import { createStackNavigator } from "@react-navigation/stack";

import FavouriteScreen from "../screens/MainScreens/FavouriteScreen";
import AddHome from "../screens/MainScreens/AddHome";
import AddWork from "../screens/MainScreens/AddWork";
import EditHome from "../screens/MainScreens/EditHome";
import EditWork from "../screens/MainScreens/EditWork";
import EditLocation from "../screens/MainScreens/EditLocation";

const Stack = createStackNavigator();

const FavoriteNavigator = (props) => {
    return (
        <Stack.Navigator initialRouteName="Favorite">
            <Stack.Group>
                <Stack.Screen name="Favorite" options={{headerShown: false}}>
                    {() => <FavouriteScreen theme={props.theme}/>}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default FavoriteNavigator;