import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RideSelect from '../screens/MainScreens/RideSelect';

const Stack = createNativeStackNavigator();

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