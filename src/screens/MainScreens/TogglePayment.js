import { View, Text, Dimensions, StyleSheet } from 'react-native'

const TogglePayment = () => {
  
  const height = Dimensions.get("window").height;

  return (
    <View 
      style={containerStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={10}
    >
      <View style={{
        height: 0.3 * height
      }} className="w-full bg-white rounded-t-[20px]"></View>
    </View>
  )
}

export default TogglePayment;

const containerStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "flex-end",
      flexDirection: "column",
  },
})