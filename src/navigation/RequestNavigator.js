import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddStop from "../screens/MainScreens/AddStop";
import DriverScreen from '../screens/MainScreens/DriverScreen';
import ContactDriver from '../screens/MainScreens/ContactDriver';
import CancelScreen from '../screens/MainScreens/CancelScreen';
import TogglePayment from "../screens/MainScreens/TogglePayment";
import RateDriver from "../screens/MainScreens/RateDriver";
import ReportDriver from "../screens/MainScreens/ReportDriver";
import UpdateDestination from "../screens/MainScreens/UpdateDestination";

const Stack = createNativeStackNavigator();

const RequestNavigator = (props) => {

    return (
      <Stack.Navigator initialRouteName='driver'>
        <Stack.Screen name="driver" options={{headerShown: false}}>
          {() => <DriverScreen theme={props.theme} />}
        </Stack.Screen>
        <Stack.Screen name="chat" options={{headerShown: false}}>
          {() => <ContactDriver theme={props.theme} />}
        </Stack.Screen>
        <Stack.Screen name="rateDriver" options={{headerShown: false}}>
          {() => <RateDriver theme={props.theme} />}
        </Stack.Screen>
        <Stack.Group screenOptions={{presentation: "modal", contentStyle: {
                backgroundColor: "transparent",
          }}}>
          <Stack.Screen name="cancel" options={{headerShown: false }}>
              {() => <CancelScreen theme={props.theme}/>}
          </Stack.Screen>
          <Stack.Screen name="addStop" options={{headerShown: false }}>
              {() => <AddStop theme={props.theme}/>}
          </Stack.Screen>
          <Stack.Screen name="changePayment" options={{headerShown: false }}>
              {() => <TogglePayment theme={props.theme} />}
          </Stack.Screen>
          <Stack.Screen name="reportDriver" options={{headerShown: false }}>
              {() => <ReportDriver theme={props.theme} />}
          </Stack.Screen>
          <Stack.Screen name="updateDestination" options={{headerShown: false }}>
              {() => <UpdateDestination theme={props.theme} />}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    )
}

export default RequestNavigator;

