import 'react-native-gesture-handler';

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from "react-native";
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import AnimatedSplash from "react-native-animated-splash-screen";
import * as SplashScreen from "expo-splash-screen";

import { store, persistor } from './store';
import StackNavigator from './src/navigation/StackNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {

  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState(colorScheme);
  const [darkMode, setDarkMode] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const [isLoaded] = useFonts({
    "os-italic" : require("./assets/fonts/OpenSans-Italic.ttf"),
    "os-light" : require("./assets/fonts/OpenSans-Light.ttf"),
    "os-mid" : require("./assets/fonts/OpenSans-Medium.ttf"),
    "os-reg" : require("./assets/fonts/OpenSans-Regular.ttf"),
    "os-sb" : require("./assets/fonts/OpenSans-SemiBold.ttf"),
    "os-b" : require("./assets/fonts/OpenSans-Bold.ttf"),
    "os-xb" : require("./assets/fonts/OpenSans-ExtraBold.ttf"),
    "mic-400" : require("./assets/fonts/Michroma-Regular.ttf"),
  })

  const onLayoutRootView = useCallback(async () => {
    if(isLoaded){
      await SplashScreen.hideAsync();
    }
  }, [isLoaded])
  
  setInterval(() => {
    setLoading(true)
  }, 4000)

  useEffect(() => {
    setTheme(colorScheme)
  }, [colorScheme])

  if(!isLoaded){
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AnimatedSplash
          translucent={true}
          isLoaded={loading}
          logoImage={require("./assets/icons/BantuRide-White.png")}
          backgroundColor={"#186F65"}
          logoHeight={350}
          logoWidth={350}
        >
          <NavigationContainer>
            <GestureHandlerRootView style={{ flex: 1}}>
              <StackNavigator handleLayout={onLayoutRootView} theme={theme} toggleDarkMode={() => {setDarkMode(!darkMode)}} />
              <StatusBar style={`${theme === "dark" ? "light" : "dark"}`}/>
            </GestureHandlerRootView>
          </NavigationContainer>
        </AnimatedSplash>
      </PersistGate>
    </Provider>
  );
}