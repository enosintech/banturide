import { useNavigation } from "@react-navigation/native";
import {Text, View, SafeAreaView } from "react-native";

import ProfileScreenTitle from "../../components/atoms/ProfileScreenTitle";

const SettingsScreen = (props) => {
    const navigation = useNavigation();

    return(
        <SafeAreaView className={`${props.theme === "dark"? "bg-[#222831]" : ""} w-full h-full`}>
            <View className={`w-full h-[10%] p-3`}>
                <ProfileScreenTitle theme={props.theme} iconName={"settings"} title="Settings" handlePress={() => {
                    navigation.goBack();
                }} />
            </View>
        </SafeAreaView>
    )
}

export default SettingsScreen;