import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearOldNotifications } from "../../slices/notificationSlice.js";

import { getItem } from "../components/lib/asyncStorage.js";

import OnboardingScreen from "../screens/Onboarding/OnboardingScreen.js";
import AuthNavigator from "./AuthNavigator.js";

const Stack = createStackNavigator()

const StackNavigator = (props) => {
    const [ showOnboarding, setShowOnboarding ] = useState(true);

    const dispatch = useDispatch();

    useEffect(()=>{
        checkIfAlreadyOnboarded();
    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            dispatch(clearOldNotifications());
          }, 30 * 60 * 1000); 
      
          return () => clearInterval(interval);
      }, [])

    const checkIfAlreadyOnboarded = async () => {   
        let onboarded = await getItem("onboarded");
        if(onboarded==1) {
            setShowOnboarding(false)
        } else {
            setShowOnboarding(true)
        }
    }

    if(showOnboarding==null){
        return null;
    }

    if(showOnboarding){
        return(
            <Stack.Navigator initialRouteName="Onboarding">
                <Stack.Screen name="Auth" options={{headerShown: false}}>
                    {() => <AuthNavigator handleLayout={props.handleLayout} theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                </Stack.Screen>
                <Stack.Screen name="Onboarding" options={{headerShown: false}}>
                    {() => <OnboardingScreen handleLayout={props.handleLayout} />  }
                </Stack.Screen>
            </Stack.Navigator>
        )
    } else {
        return(
            <Stack.Navigator initialRouteName="Auth">
                <Stack.Screen name="Auth" options={{headerShown: false}}>
                    {() => <AuthNavigator handleLayout={props.handleLayout} theme={props.theme}  toggleDarkMode={props.toggleDarkMode}/>}
                </Stack.Screen>
            </Stack.Navigator>
        )
    }
}

export default StackNavigator;