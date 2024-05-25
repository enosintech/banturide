import { View, Dimensions, Text } from "react-native";
import LottieView from "lottie-react-native";

const LoadingBlur = (props) => {

    const height = Dimensions.get("window").height;

  return (
    <View style={{
        backgroundColor: props.color ? props.color : 'rgba(0, 0, 0, 0.7)',
        height: height
    }} className={`absolute w-full ${props.loading ? "flex" : "hidden"} left-0 top-0 items-center justify-center z-20`}>
        <View className={`w-[75%] h-[30%] bg-white shadow rounded-[20px] items-center justify-center`}>
            <LottieView
            source={require("../../../assets/animations/loading.json")} 
                loop
                autoPlay
                speed={1}
                style={{
                    width: 150,
                    height: 150,
                }}
            />
        </View>
    </View>
  )
}

export default LoadingBlur;