import { View, Text, StyleSheet, Dimensions } from 'react-native';

const ReportDriver = (props) => {

    const height = Dimensions.get("window").height;

  return (
    <View
        style={containerStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={10}
    >
      <View style={{
        height: 0.3 * height
      }} className={`w-full flex flex-col ${props.theme === "dark" ? "bg-dark-primary" : "bg-white"} rounded-t-[40px] px-3`}>
        <Text>ReportDriver</Text>
      </View>
    </View>
  )
}

export default ReportDriver;

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "column",
    },
})