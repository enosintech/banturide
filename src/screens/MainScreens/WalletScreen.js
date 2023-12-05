import {Text, View, SafeAreaView } from "react-native";

import ScreenTitle from "../../components/atoms/ScreenTitle.js"

const WalletScreen = (props) => {
    return(
        <SafeAreaView className={`w-full h-full ${props.theme === "dark" ? "bg-[#222831]" : ""}`}>
            <ScreenTitle theme={props.theme} iconName="account-balance-wallet" title="Wallet"/>
            <View className="w-full h-[90%] p-5 flex items-center">
                <Text style={{fontFamily:"os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"} text-[20px]`}>Feature coming soon</Text>
            </View>
        </SafeAreaView>
    )
}

export default WalletScreen;