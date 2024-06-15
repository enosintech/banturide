import {Text, View, SafeAreaView, ScrollView, TouchableOpacity, PixelRatio } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Favorite from "../../components/atoms/Favourite";
import ScreenTitle from "../../components/atoms/ScreenTitle";
import { safeViewAndroid } from "../AuthScreens/WelcomeScreen";

import { selectFavAddressChanged, selectFavAddressUpdated, setFavAddressUpdated, setFavoriteWorkAddress } from "../../../slices/navSlice";
import { selectUserInfo } from "../../../slices/authSlice";

const FavouriteScreen = (props) => {

    const userInfo = useSelector( selectUserInfo );

    const navigation = useNavigation();
    const routes = useRoute();
    const dispatch = useDispatch();

    const { saveMessage } = routes.params ? routes.params : "No Message";

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    const favAddressChanged = useSelector(selectFavAddressChanged);
    const favAddressUpdated = useSelector(selectFavAddressUpdated);

    const [ favoritesData, setFavoritesData ] = useState([]);
    const [ loading, setLoading ] = useState(false); 
    const [ homeAdded, setHomeAdded ] = useState(false);
    const [ workAdded, setWorkAdded ] = useState(false);

    const options = {
        method: "GET",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch(setFavAddressUpdated(false))
        }, 5000)
    }, [favAddressUpdated])

    useEffect(() => {
        setLoading(true)

        const fetchFavorites = async () => {
            try {
                const response = await fetch(`https://banturide.onrender.com/favorites/get-favorites/${userInfo?._id}`, options);

                const result = await response.json();
                setLoading(false)
                setFavoritesData(result)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }

        fetchFavorites()

    }, [favAddressChanged])

    useEffect(() => {

        const checkForHome = () => {

            if(favoritesData.length < 1){
                setHomeAdded(false)
                return
            }

            for(let i = 0; i < favoritesData.length; i++){
                if(Object.values(favoritesData[i]).includes("home")){
                    setHomeAdded(true)
                    return;
                } else {
                    setHomeAdded(false)
                }
            }

        }

        const checkForWork = () => {

            if(favoritesData.length < 1){
                setWorkAdded(false)
                return
            }

            for(let i = 0; i < favoritesData.length; i++){
                if(Object.values(favoritesData[i]).includes("work")){
                    setWorkAdded(true)
                    return;
                } else {
                    setWorkAdded(false)
                }
            }

        }

        checkForHome();
        checkForWork();

    }, [favoritesData])

    return(
        <SafeAreaView style={safeViewAndroid.AndroidSafeArea} className={`w-full h-full ${props.theme === "dark" ? "bg-[#222831]" : " bg-white"} relative`}>
            <ScreenTitle theme={props.theme} iconName="favorite" title="Favorites"/>
            {favAddressUpdated &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-[65%] h-[90%] bg-black rounded-[10px] flex items-center justify-center`}>
                        <Text style={{fontSize: getFontSize(14)}} className="text-white font-light tracking-tight">{saveMessage}</Text>
                    </View>
                </View>
            }
            <View className={`w-full px-5 h-[6%]`}>
                <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-light tracking-tight`}>Add your frequent destinations to easily access them when booking</Text>
            </View>
            <View className={`w-full border-b-[0.5px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <TouchableOpacity disabled={homeAdded === false && loading === true ? true : homeAdded === false && loading === false ? false : true} className={`h-[8%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} ${homeAdded ? "opacity-30" : "opacity-100"} flex-row items-center justify-between px-3 shadow-2xl`} onPress={() => {
                navigation.navigate("addhome")
            }}>
                <View className="flex-row items-center">
                    <MaterialIcons name="home-filled" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}> Add Home</Text>
                </View>
                <View>
                    <MaterialIcons name="add" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={workAdded === false && loading === true ? true : workAdded === false && loading === false ? false : true} className={`h-[8%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} ${workAdded ? "opacity-30" : "opacity-100"} flex-row items-center justify-between px-3 shadow-2xl`} onPress={() => {
                navigation.navigate("addwork")
            }}>
                <View className="flex-row items-center">
                    <MaterialIcons name="work" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight ml-[1px]`}> Add Work</Text>
                </View>
                <View>
                    <MaterialIcons name="add" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity className={`h-[8%] w-full ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} flex-row items-center justify-between px-3 shadow-2xl`} onPress={() => {
                navigation.navigate("addlocation")
            }}>
                <View className="flex-row items-center">
                    <MaterialIcons name="add-location" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                    <Text style={{fontSize: getFontSize(15)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} tracking-tight`}> Add Location</Text>
                </View>
                <View>
                    <MaterialIcons name="add" size={getFontSize(30)} color={`${props.theme === "dark" ? "white" : "black"}`}/>
                </View>
            </TouchableOpacity>
            <View className={`border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <View className={`h-[52.2%] w-full shadow-2xl`}>
                <View className={`w-full ${props.theme === "dark" ? "bg-[#222831] border-gray-900" : "bg-white border-gray-200"} p-3 border-b-[0.25px] border-solid`}>
                    <Text style={{fontSize: getFontSize(20)}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-extrabold tracking-tight`}>Saved Places</Text>
                </View>
                <ScrollView className="w-full" contentContainerStyle={{
                    alignItems: "center",
                    paddingTop: 5,
                }}>
                    {
                        loading 
                        ?
                        <Text style={{fontSize: getFontSize(14)}} className={`mt-2 tracking-tight`}>Loading</Text>
                        :
                        favoritesData.length > 0
                        ?
                        favoritesData.map((fav, index) => (
                            <Favorite key={fav._id} index={index} theme={props.theme} iconName={fav.type === "home" ? "home-filled" : fav.type === "work" ? "work" : ""} addName={fav.type === "home" ? "Home" : fav.type === "work" ? "Work" : fav.name} address={fav.address} {...fav} />
                        ))
                        :
                        <Text style={{fontSize: getFontSize(14)}} className={`mt-2 tracking-tight`}>No Saved Addresses</Text>
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default FavouriteScreen;
