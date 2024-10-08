import { StyleSheet, View, Dimensions, Platform } from "react-native";
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
                tabBarIconStyle: {
                    marginBottom: Platform.OS === "ios" ? -fontSize * 0.70 : fontSize * 0.2,
                },
                tabBarStyle: {
                    position: "absolute",
                    borderTopWidth: 0,
                    height: "9%",
                    justifyContent: "space-evenly", 
                    alignItems: 'center',
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
                    <View className={`items-center justify-center px-[20%] py-[7%] rounded-full ${props.theme === "dark" ? focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]" : focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]"}`}>
                        <MaterialIcons 
                            name="home-filled"
                            size={fontSize * 1.3}
                            color={color}
                        />
                    </View>
                )
            }}>
                {() => <HomeNavigator initialRegion={props.initialRegion} setInitialRegion={props.setInitialRegion} handleLayout={props.handleLayout} theme={props.theme} />}
            </Tab.Screen>
            <Tab.Screen name="Favourite"  options={{
                headerShown: false,
                tabBarIcon: ({ size, color, focused}) => (
                    <View className={`items-center justify-center px-[20%] py-[7%] rounded-full ${props.theme === "dark" ? focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]" : focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]"}`}>
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
                    <View className={`items-center justify-center px-[20%] py-[7%] rounded-full ${props.theme === "dark" ? focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]" : focused ? "bg-[#186f65]" : "bg-[rgba(0,0,0,0)]"}`}>
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
            height: 7,
            width: 0,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10,
    },   
});