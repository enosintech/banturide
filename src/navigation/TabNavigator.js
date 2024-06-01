import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, PixelRatio } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import HomeNavigator from "./HomeNavigator.js";
import FavoriteNavigator from "./FavoriteNavigator.js";
import ProfileNavigator from "./ProfileNavigator.js";

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return (
        <Tab.Navigator initialRouteName="HomeNav"
            screenOptions={({}) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    borderTopWidth: 0,
                    height: "11%",
                    backgroundColor: `${props.theme === "dark" ? "#0e1115" : "white"}`,
                    ...styles.shadow
                },
                tabBarActiveTintColor: "#186F65",
                tabBarInactiveTintColor: `${props.theme === "dark" ? "white" : "gray"}`
            })}
            >
            <Tab.Screen name="HomeNav" options={{
                headerShown: false,
                tabBarIcon: ({ size, color}) => (
                    <View className="items-center justify-center" style={{top: 10}}>
                        <MaterialIcons 
                            name="home-filled"
                            size={size}
                            color={color}
                        />
                        <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight mt-1`} style={{fontSize: getFontSize(10)}}>Home</Text>
                    </View>
                )
            }}>
                {() => <HomeNavigator handleLayout={props.handleLayout} theme={props.theme} />}
            </Tab.Screen>
            <Tab.Screen name="Favourite"  options={{
                headerShown: false,
                tabBarIcon: ({ size, color}) => (
                    <View className="items-center justify-center" style={{top: 10}}>
                        <MaterialIcons 
                            name="favorite"
                            size={size}
                            color={color}
                        />
                        <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight mt-1`} style={{fontSize: getFontSize(10)}}>Favorites</Text>
                    </View>
                )
                 }}>
                    {() => <FavoriteNavigator theme={props.theme} />}
                 </Tab.Screen> 
            <Tab.Screen name="ProfileNav"  options={{
                headerShown: false,
                tabBarIcon: ({ size, color}) => (
                    <View className="items-center justify-center" style={{top: 10}}>
                        <MaterialIcons 
                            name="person"
                            size={size}
                            color={color}
                        />
                        <Text className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight mt-1`} style={{fontSize: getFontSize(10)}}>Profile</Text>
                    </View>
                )
                }}>
                    {() => <ProfileNavigator theme={props.theme} toggleDarkMode={props.toggleDarkMode}/>}
                </Tab.Screen> 
        </Tab.Navigator>
    )
}

export default TabNavigator;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 7,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10
    }
});