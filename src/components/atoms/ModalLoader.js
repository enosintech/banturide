import { View, ActivityIndicator } from 'react-native';

const ModalLoader = (props) => {

  return (
    <View className={`w-[75%] h-[30%] ${props.theme === "dark" ? "bg-[#222831]" : "bg-white"} shadow-sm rounded-[40px] items-center justify-center`}>
        <ActivityIndicator size={"large"} color={props.theme === "dark" ? "#ffffff" : "#000000"}/>
    </View>
  )
}

export default ModalLoader;