import {Text, View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import Favorite from "../../components/atoms/Favourite";
import ScreenTitle from "../../components/atoms/ScreenTitle";

const FavouriteScreen = (props) => {
    const navigation = useNavigation();

    return(
        <SafeAreaView className={`w-full h-full ${props.theme === "dark" ? "bg-[#222831]" : ""}`}>
            <ScreenTitle theme={props.theme} iconName="favorite" title="Favorites"/>
            <View className={`w-full px-5 h-[3%]`}>
                <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px]`}>Add your frequent destinations</Text>
            </View>
            <View className={`w-full border-b-[0.5px] mt-5 border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <TouchableOpacity className={`h-[8%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} flex-row items-center justify-between px-3 shadow-2xl`} onPress={() => {
                navigation.navigate("addhome")
            }}>
                <View className="flex-row items-center">
                    <MaterialIcons name="home-filled" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontFamily: "os-reg"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px]`}> Add Home</Text>
                </View>
                <View>
                    <MaterialIcons name="add" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity className={`h-[8%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} flex-row items-center justify-between px-3 shadow-2xl`} onPress={() => {
                navigation.navigate("addwork")
            }}>
                <View className="flex-row items-center">
                    <MaterialIcons name="work" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontFamily: "os-reg"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px]`}> Add Work</Text>
                </View>
                <View>
                    <MaterialIcons name="add" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity className={`h-[8%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} flex-row items-center justify-between px-3 shadow-2xl`} onPress={() => {
                navigation.navigate("addlocation")
            }}>
                <View className="flex-row items-center">
                    <MaterialIcons name="add-location" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontFamily: "os-reg"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[15px]`}> Add Location</Text>
                </View>
                <View>
                    <MaterialIcons name="add" size={30} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </View>
            </TouchableOpacity>
            <View className={`border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <View className={`h-[46%] w-full shadow-2xl`}>
                <View className={`w-full ${props.theme === "dark" ? "bg-[#222831] border-gray-900" : "bg-white border-gray-200"} p-3 border-b-[0.25px] border-solid`}>
                    <Text style={{fontFamily: "os-xb"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[20px]`}>Saved Places</Text>
                </View>
                <ScrollView className="w-full">
                    <Favorite theme={props.theme} iconName="home-filled" name="Home" address="Avondale 37B, Eucalyptus Road, Lusaka, Zambia"/>
                    <Favorite theme={props.theme} name="Muna's House" address="House No 50, Station Road, Fairview, Monze, Zambia"/>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default FavouriteScreen;
