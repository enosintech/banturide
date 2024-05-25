import { useNavigation } from "@react-navigation/native";
import {Text, View, SafeAreaView, ScrollView } from "react-native";

import ProfileScreenTitle from "../../components/atoms/ProfileScreenTitle";

const HistoryScreen = (props) => {
    const navigation = useNavigation();

    return(
        <SafeAreaView className={`${props.theme === "dark"? "bg-[#222831]" : ""} w-full h-full`}>
            <View className={`w-full h-[10%] p-3`}>
                <ProfileScreenTitle theme={props.theme} iconName={"history"} title="History" handlePress={() => {
                    navigation.goBack();
                }} />
            </View>
            <View className="w-full h-[90%]">
                <View className="w-full h-fit px-5">
                    <Text style={{fontFamily: "os-light"}} className="text-[15px]">Places you have been</Text>
                </View>
                <ScrollView className="w-full" contentContainerStyle={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    paddingTop: 10
                }}>
                    <View className="w-[95%] h-[100px] bg-white shadow flex flex-col rounded-2xl">
                        <View className="w-full h-1/2 bg-red-500 flex flex-row items-center justify-between px-5">
                            <Text></Text>
                            <Text></Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default HistoryScreen;