import {Text, View, SafeAreaView } from "react-native";

import ScreenTitle from "../../components/atoms/ScreenTitle";

const OffersScreen = (props) => {
    return(
        <SafeAreaView className={`${props.theme === "dark" ? "bg-[#222831]" : ""} w-full h-full`}>
            <ScreenTitle theme={props.theme} iconName="local-offer" title="Offers"/>

            <View className="w-full h-[90%] p-5 flex items-center">
                <Text style={{fontFamily:"os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[20px]`}>Feature coming soon</Text>
            </View>
        </SafeAreaView>
    )
}

export default OffersScreen;