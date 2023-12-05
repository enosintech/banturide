import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RequestScreen from "../screens/MainScreens/RequestScreen";

const Stack = createNativeStackNavigator();

const RequestNavigator = (props) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="requests" options={{headerShown: false}}>
            {() => <RequestScreen theme={props.theme}/>}
        </Stack.Screen>
    </Stack.Navigator>
  )
}

export default RequestNavigator;