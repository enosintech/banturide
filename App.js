import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AnimatedSplash from "react-native-animated-splash-screen";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { store } from './store';
import StackNavigator from './src/navigation/StackNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [theme, setTheme] = useState("light");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if(darkMode){
      setToDark()
    } else {
      setToLight()
    }
  }, [darkMode])

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

  const setToLight = () => {
    setTheme("light");
  }

  const setToDark = () => {
    setTheme("dark");
  }

  const onLayoutRootView = useCallback(async () => {
    if(isLoaded){
      await SplashScreen.hideAsync();
    }
  }, [isLoaded])

  const [ loading, setLoading ] = useState(false);

  setInterval(() => {
    setLoading(true)
  }, 5000)

  if(!isLoaded){
    return null;
  }

  return (
    <Provider store={store}>
      <AnimatedSplash
        translucent={true}
        isLoaded={loading}
        logoImage={require("./assets/icons/logo.png")}
        backgroundColor={"#186F65"}
        logoHeight={350}
        logoWidth={350}
      >
        <NavigationContainer>
            <StackNavigator handleLayout={onLayoutRootView} theme={theme} toggleDarkMode={() => {setDarkMode(!darkMode)}} />
            <StatusBar style={`${theme === "dark" ? "light" : "dark"}`}/>
        </NavigationContainer>
      </AnimatedSplash>
    </Provider>
  );
}