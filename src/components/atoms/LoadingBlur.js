import { View, Dimensions, Text, ActivityIndicator } from "react-native";

const LoadingBlur = (props) => {

    const height = Dimensions.get("window").height;

  return (
    <View style={{
        backgroundColor: props.color ? props.color : 'rgba(0, 0, 0, 0.7)',
        height: height
    }} className={`absolute w-full ${props.loading ? "flex" : "hidden"} left-0 top-0 items-center justify-center z-20`}>
        <View className={`w-[75%] h-[30%] ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow rounded-[40px] items-center justify-center`}>
            <ActivityIndicator size={"large"} color={props.theme === "dark" ? "#ffffff" : "#000000"} />
        </View>
    </View>
  )
}

export default LoadingBlur;