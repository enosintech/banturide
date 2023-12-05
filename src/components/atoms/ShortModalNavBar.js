import { View } from "react-native";

const ShortModalNavBar = (props) => {
    return(
        <View className={`w-[15%] h-[30%] ${props.theme === "light" ? "bg-gray-400" : props.theme === "dark" ? "bg-white" : "bg-gray-400"}  rounded`}></View>
    )
}

export default ShortModalNavBar;