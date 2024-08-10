import { View, PixelRatio, ActivityIndicator } from 'react-native';

const ModalLoader = () => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

  return (
    <View className={`w-[75%] h-[30%] bg-white shadow rounded-[10px] items-center justify-center`}>
        <ActivityIndicator size={"large"} color="#000000" />
    </View>
  )
}

export default ModalLoader;