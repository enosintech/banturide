import { StyleSheet, View, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import HomeNavigator from "./HomeNavigator.js";
import FavoriteNavigator from "./FavoriteNavigator.js";
import ProfileNavigator from "./ProfileNavigator.js";

const { width } = Dimensions.get("window")

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => {

    const fontSize = width * 0.05;

    return (
        <Tab.Navigator initialRouteName="HomeNav"
            screenOptions={({}) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderTopWidth: 0,
                    height: "9%",
                    backgroundColor: `${props.theme === "dark" ? "#0e1115" : "white"}`,
                    ...styles.shadow
                },
                tabBarActiveTintColor: `${props.theme === "dark" ? "white" : "white"}`,
                tabBarInactiveTintColor: `${props.theme === "dark" ? "white" : "#186f65"}`
            })}
            >
            <Tab.Screen name="HomeNav" options={{
                headerShown: false,
                tabBarIcon: ({ size, color, focused }) => (
                    <View className={`items-center justify-center px-7 py-2 rounded-full ${props.theme === "dark" ? focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]" : focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]"}`} style={{top: 10}}>
                        <MaterialIcons 
                            name="home-filled"
                            size={fontSize * 1.3}
                            color={color}
                        />
                    </View>
                )
            }}>
                {() => <HomeNavigator handleLayout={props.handleLayout} theme={props.theme} />}
            </Tab.Screen>
            <Tab.Screen name="Favourite"  options={{
                headerShown: false,
                tabBarIcon: ({ size, color, focused}) => (
                    <View className={`items-center justify-center px-7 py-2 rounded-full ${props.theme === "dark" ? focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]" : focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]"}`} style={{top: 10}}>
                        <MaterialIcons 
                            name="favorite"
                            size={fontSize * 1.3}
                            color={color}
                        />
                    </View>
                )
                 }}>
                    {() => <FavoriteNavigator theme={props.theme} />}
                 </Tab.Screen> 
            <Tab.Screen name="ProfileNav"  options={{
                headerShown: false,
                tabBarIcon: ({ size, color, focused}) => (
                    <View className={`items-center justify-center px-7 py-2 rounded-full ${props.theme === "dark" ? focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]" : focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]"}`} style={{top: 10}}>
                        <MaterialIcons 
                            name="person"
                            size={fontSize * 1.3}
                            color={color}
                        />
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