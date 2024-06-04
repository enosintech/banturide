import { View, PixelRatio } from 'react-native';
import LottieView from "lottie-react-native";

const ModalLoader = () => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

  return (
    <View className={`w-[75%] h-[30%] bg-white shadow rounded-[30px] items-center justify-center`}>
        <LottieView
            source={require("../../../assets/animations/loading.json")} 
            loop
            autoPlay
            speed={1}
            style={{
                width: getFontSize(150),
                height: getFontSize(150),
            }}
        />
    </View>
  )
}

export default ModalLoader;