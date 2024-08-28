import { createStackNavigator } from "@react-navigation/stack";

import RideSelect from '../screens/MainScreens/RideSelect';

const Stack = createStackNavigator();

const BookNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName='RideSelect'>
        <Stack.Screen name='RideSelect' options={{headerShown: false}}>
            {() => <RideSelect initialRegion={props.initialRegion} theme={props.theme}/>}
        </Stack.Screen>
    </Stack.Navigator>
  )
}

export default BookNavigator;