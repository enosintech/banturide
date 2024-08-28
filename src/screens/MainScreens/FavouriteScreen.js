import {Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import Favorite from "../../components/atoms/Favourite";
import ScreenTitle from "../../components/atoms/ScreenTitle";

import { selectFavAddressChanged, selectFavAddressDeleted, selectFavAddressUpdated } from "../../../slices/navSlice";
import { selectIsSignedIn, selectToken, setIsSignedIn, setToken, setTokenFetched, setUserDataFetched, setUserDataSet, setUserInfo } from "../../../slices/authSlice";

const { width } = Dimensions.get("window");

const FavouriteScreen = (props) => {

    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const tokens = useSelector(selectToken);
    const isSignedIn = useSelector(selectIsSignedIn);

    const { saveMessage } = route.params ? route.params : "";

    const fontSize = width * 0.05;

    const favAddressChanged = useSelector(selectFavAddressChanged);
    const favAddressUpdated = useSelector(selectFavAddressUpdated);
    const favAddressDeleted = useSelector(selectFavAddressDeleted);

    const [favoritesData, setFavoritesData] = useState([]);
    const [ error, setError ] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [homeAdded, setHomeAdded] = useState(false);
    const [workAdded, setWorkAdded] = useState(false);

    let hasRenderedWork = false;

    const sortedFavorites = favoritesData.sort((a, b) => {
        if (a.type === "home") return -1;
        if (b.type === "home") return 1;
        if (a.type === "work") return b.type === "home" ? 1 : -1;
        return 0;
    });

    useEffect(() => {
        setLoading(true)

        const fetchFavorites = async () => {
            try {
                const response = await fetch(`https://banturide-api.onrender.com/favorites/get-favorites`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokens?.idToken}`,
                        'x-refresh-token': tokens?.refreshToken,
                    }
                });

                const result = await response.json();

                if(result.success === false){
                    throw new Error(result.message || result.error)
                } else {
                    setFavoritesData(result.favoriteLocations)
                }
                
            } catch (error) {
                if(error === "Unauthorized"){
                    dispatch(setUserInfo(null))
                    dispatch(setToken(null))
                    dispatch(setIsSignedIn(!isSignedIn))
                    dispatch(setTokenFetched(false))
                    dispatch(setUserDataFetched(false))
                    dispatch(setUserDataSet(false))
                } else {
                    setError(true)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()

    }, [favAddressChanged])

    useEffect(() => {

        const checkForHome = () => {
            if (favoritesData.length < 1) {
                setHomeAdded(false)
                return
            }

            for (let i = 0; i < favoritesData.length; i++) {
                if (Object.values(favoritesData[i]).includes("home")) {
                    setHomeAdded(true)
                    return;
                } else {
                    setHomeAdded(false)
                }
            }
        }

        const checkForWork = () => {
            if (favoritesData.length < 1) {
                setWorkAdded(false)
                return
            }

            for (let i = 0; i < favoritesData.length; i++) {
                if (Object.values(favoritesData[i]).includes("work")) {
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

    return (
        <SafeAreaView className={`w-full h-full ${props.theme === "dark" ? "bg-dark-primary" : ""} relative`}>
            {favAddressUpdated &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit px-6 h-[90%] bg-black rounded-[50px] flex items-center justify-center`}>
                        <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-light text-center tracking-tight">{saveMessage}</Text>
                    </View>
                </View>
            }

            {favAddressDeleted &&
                <View className={`w-full h-[6%] absolute z-20 top-28 flex items-center justify-center`}>
                    <View className={`w-fit px-6 h-[90%] bg-black rounded-[50px] flex items-center justify-center`}>
                        <Text style={{ fontSize: fontSize * 0.7 }} className="text-white font-light text-center tracking-tight">{favAddressDeleted}</Text>
                    </View>
                </View>
            }
            <ScreenTitle theme={props.theme} iconName="favorite" title="Favorites" />
            <View className={`w-full px-5 h-[6%]`}>
                <Text style={{ fontSize: fontSize * 0.7 }} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-medium tracking-tighter`}>Add your frequent destinations to easily access them when booking</Text>
            </View>
            <View className={`w-full h-[15%] flex flex-row items-center justify-evenly`}>
                <TouchableOpacity disabled={loading || homeAdded ? true : false}  className={`w-[28%] h-[45%] bg-[#186f65] rounded-full shadow ${homeAdded || loading ? "opacity-30" : "opacity-100"} flex flex-row items-center justify-center`} onPress={() => {
                    navigation.navigate("addhome")
                }}>
                    <MaterialIcons name="home-filled" size={fontSize * 1.5} color={`white`} />
                    <MaterialIcons name="add" color={"white"} size={fontSize * 1.1} />
                </TouchableOpacity>
                <TouchableOpacity disabled={loading || workAdded ? true : false} className={`w-[28%] h-[45%] bg-[#186f65] rounded-full shadow ${workAdded || loading ? "opacity-30" : "opacity-100"} flex flex-row items-center justify-center`} onPress={() => {
                    navigation.navigate("addwork")
                }}>
                    <MaterialIcons name="work" size={fontSize * 1.3} color={`white`} />
                    <MaterialIcons name="add" color={"white"} size={fontSize * 1.1} />
                </TouchableOpacity>
                <TouchableOpacity className={`w-[28%] h-[45%] bg-[#186f65] rounded-full shadow flex flex-row items-center justify-center`} onPress={() => {
                    navigation.navigate("addlocation")
                }}>
                    <MaterialIcons name="add-location" size={fontSize * 1.3} color={`white`} />
                    <MaterialIcons name="add" color={"white"} size={fontSize * 1.1} />
                </TouchableOpacity>
            </View>
            <View className={`border-b-[0.25px] border-solid ${props.theme === "dark" ? "border-gray-900" : "border-gray-400"}`}></View>
            <View className={`h-[60%] w-full`} style={{ overflow: "visible"}}>
                <View className={`w-full p-3`}>
                    <Text style={{ fontSize: fontSize * 0.9}} className={`${props.theme === "dark" ? "text-white" : "text-black"} font-black tracking-tighter`}>Saved Places</Text>
                </View>
                <ScrollView className="w-full" contentContainerStyle={{
                    alignItems: "center",
                    paddingTop: 5,
                }}>
                    {
                        loading
                            ?
                                <Text style={{ fontSize: fontSize * 0.8 }} className={`mt-2 tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Loading...</Text>
                            :
                            error 
                            ?
                                <Text style={{ fontSize: fontSize * 0.8 }} className={`mt-2 tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>Something Went Wrong</Text>
                            :
                            sortedFavorites.length > 0
                                ?
                                sortedFavorites.map((fav, index) => {
                                    if (!hasRenderedWork && fav.type !== "home" && fav.type !== "work") {
                                        hasRenderedWork = true;
                                        return (
                                            <React.Fragment key={fav.id}>
                                                <View className={`w-[90%] my-2 h-0 border-[0.5px] ${props.theme === "dark" ? "border-white" : "border-neutral-400"}`}></View>
                                                <Favorite
                                                    index={index}
                                                    theme={props.theme}
                                                    iconName={fav.type === "home" ? "home-filled" : fav.type === "work" ? "work" : ""}
                                                    addName={fav.type === "home" ? "Home" : fav.type === "work" ? "Work" : fav.name}
                                                    address={fav.address}
                                                    {...fav}
                                                />
                                            </React.Fragment>
                                        );
                                    }

                                    return (
                                        <Favorite
                                            key={fav.id}
                                            index={index}
                                            theme={props.theme}
                                            iconName={fav.type === "home" ? "home-filled" : fav.type === "work" ? "work" : ""}
                                            addName={fav.type === "home" ? "Home" : fav.type === "work" ? "Work" : fav.name}
                                            address={fav.address}
                                            {...fav}
                                        />
                                    );
                                })
                                :
                                <Text style={{ fontSize: fontSize * 0.8 }} className={`mt-2 tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>No Saved Places</Text>
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default FavouriteScreen;
