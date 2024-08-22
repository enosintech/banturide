import { View } from 'react-native';
import LottieView from "lottie-react-native";

const PageLoader = (props) => {
  return (
    <View className={`rounded-[25px] overflow-hidden flex items-center justify-center`} style={{
        width: props.width,
        height: props.height
    }}>
    {props.theme === "dark" 
    ?
        <LottieView 
            source={require("../../../assets/animations/loaderDark.json")}
            loop
            autoPlay
            speed={1}
            style={{
                width: 200,
                height: 200
            }}
        />
    :
        <LottieView 
            source={require("../../../assets/animations/loader.json")}
            loop
            autoPlay
            speed={1}
            style={{
                width: 200,
                height: 200
            }}
        />
    }
    </View>
  )
}

export default PageLoader;