import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import HomeNavigator from "./HomeNavigator.js";
import FavoriteNavigator from "./FavoriteNavigator.js";
import ProfileNavigator from "./ProfileNavigator.js";

import WalletScreen from "../screens/MainScreens/WalletScreen.js";
import OffersScreen from "../screens/MainScreens/OffersScreen.js";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={{
                top: -30,
                justifyContent: 'center',
                alignItems: "center",
            }}
        >
            <View 
            style={{
                width: 70,
                height: 70,
                backgroundColor: "#186F65",
                borderRadius: 35
            }}
            className="shadow-xl">
                {children}
            </View>
            <Text style={{fontFamily: "os-reg", top:10}} className="text-[12px] text-[#186F65]">Wallet</Text>
        </TouchableOpacity>
    )
}

const TabNavigator = (props) => {
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
                        <Text className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`} style={{fontFamily: "os-reg"}}>Home</Text>
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
                        <Text className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`} style={{fontFamily: "os-reg"}}>Favorites</Text>
                    </View>
                )
                 }}>
                    {() => <FavoriteNavigator theme={props.theme} />}
                 </Tab.Screen> 
            <Tab.Screen name="Wallet"  options={{
                headerShown: false,
                tabBarIcon: ({ size }) => (
                    <MaterialIcons 
                        name="account-balance-wallet"
                        size={size}
                        color="white"
                    />
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props}/>
                )
                }}>
                    {() => <WalletScreen theme={props.theme} />}
                </Tab.Screen>
            <Tab.Screen name="Offers"  options={{
                headerShown: false, 
                tabBarBadgeStyle: {
                    top: 10
                },
                tabBarIcon: ({ size, color}) => (
                    <View className="items-center justify-center" style={{top: 10}}>
                        <MaterialIcons 
                            name="local-offer"
                            size={size}
                            color={color}
                        />
                        <Text className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`} style={{fontFamily: "os-reg"}}>Offers</Text>
                    </View>
                )
                }}>
                    {() => <OffersScreen theme={props.theme} />}
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
                        <Text className={`text-[10px] ${props.theme === "dark" ? "text-white" : "text-black"}`} style={{fontFamily: "os-reg"}}>Profile</Text>
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
        shadowColor: "#7F5DF0",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});