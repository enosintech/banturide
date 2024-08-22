import { View, Dimensions, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";

import { setItem } from "../../components/lib/asyncStorage";

const { width } = Dimensions.get("window")

const OnboardingScreen = (props) => {
    const navigation = useNavigation();

    const fontSize = width * 0.05;

    const handleDone = () => {
        navigation.navigate("Auth")
        navigation.reset({
            index: 0,
            routes: [{name: "Auth"}]
        })
        setItem("onboarded", "1");
    }

    return (
        <View className="flex-1 bg-white" onLayout={props.handleLayout}>
            <Onboarding 
                onDone={handleDone}
                onSkip={handleDone}
                containerStyles={{paddingHorizontal: 15}}
                pages={[
                    {
                        backgroundColor: "#186F65",
                        image: <View className="items-center justify-center">
                                    <Image 
                                        source={require("../../../assets/icons/BantuRide.png")}
                                        style={styles.image}
                                    />
                                </View>,
                        title: "Welcome to Bantu Ride",
                        subtitle: "a ride-hailing app for the people",
                        titleStyles: {
                            fontWeight: "900",
                            fontSize: fontSize * 1.4,
                        },
                        subTitleStyles: {
                            fontWeight: "400",
                            color: "gray",
                            fontSize: fontSize * 0.8
                        }
                    },
                    {
                        backgroundColor: "#22a394",
                        image: <View className="items-center justify-center">
                                    <LottieView 
                                        source={require("../../../assets/animations/anywhere.json")} 
                                        autoPlay
                                        loop
                                        speed={1}
                                        style={{
                                            width: width*0.8,
                                            height: width*0.9,
                                        }}
                                    />
                                </View>,
                        title: "Anywhere you are",
                        subtitle: "Find your way",
                        titleStyles: {
                            fontWeight: "900",
                            fontSize: fontSize * 1.4,
                        },
                        subTitleStyles: {
                            fontWeight: "400",
                            color: "gray",
                            fontSize: fontSize * 0.8
                        }
                    },
                    {
                        backgroundColor: "#78faeb",
                        image: <View className="items-center justify-center">
                                    <LottieView 
                                        source={require("../../../assets/animations/anytime.json")} 
                                        autoPlay 
                                        loop
                                        style={{
                                            width: width*0.8,
                                            height: width*0.9,
                                        }}
                                    />
                                </View>,
                        title: "At anytime",
                        subtitle: "Even at midnight",
                        titleStyles: {
                            fontWeight: "900",
                            fontSize: fontSize * 1.4,
                        },
                        subTitleStyles: {
                            fontWeight: "400",
                            color: "gray",
                            fontSize: fontSize * 0.8
                        }
                    },
                    {
                        backgroundColor: "#fff",
                        image: <View className="items-center justify-center">
                                    <LottieView 
                                        source={require("../../../assets/animations/bookcar.json")} 
                                        autoPlay 
                                        loop
                                        style={{
                                            width: width*0.4,
                                            height: width*0.55,
                                        }}
                                    />
                                </View>,
                        title: "Book your ride",
                        subtitle: "And get to wherever",
                        titleStyles: {
                            fontWeight: "900",
                            fontSize: fontSize * 1.4,
                        },
                        subTitleStyles: {
                            fontWeight: "400",
                            color: "gray",
                            fontSize: fontSize * 0.8
                        }
                    },
                ]}
            />
        </View>
    )
}

export default OnboardingScreen;

const styles = StyleSheet.create({
    image: {
        width: width * 0.85,
        height: width * 0.7,
        resizeMode: 'contain', 
    },
});
