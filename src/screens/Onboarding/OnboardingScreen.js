import { useEffect, useRef } from "react";
import { View, Dimensions, PixelRatio } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

import { setItem } from "../../components/lib/asyncStorage";

const OnboardingScreen = (props) => {
    const navigation = useNavigation();
    const animation = useRef(null)

    const { width } = Dimensions.get("window")

    useEffect(() => {
        animation.current?.play()
    }, [])

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
                                    <LottieView 
                                        ref={animation}
                                        source={require("../../../assets/animations/welcome.json")}  
                                        loop
                                        autoPlay
                                        speed={1}
                                        style={{
                                            width: width*0.8,
                                            height: width*0.9,
                                        }}
                                    />
                                </View>,
                        title: "Welcome to Bantu Ride",
                        subtitle: "A transport app for the people"
                    },
                    {
                        backgroundColor: "#22a394",
                        image: <View className="items-center justify-center">
                                    <LottieView 
                                        ref={animation}
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
                        subtitle: "Find your way"
                    },
                    {
                        backgroundColor: "#78faeb",
                        image: <View className="items-center justify-center">
                                    <LottieView 
                                        ref={animation}
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
                        subtitle: "Even at midnight"
                    },
                    {
                        backgroundColor: "#fff",
                        image: <View className="items-center justify-center">
                                    <LottieView
                                        ref={animation} 
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
                        subtitle: "And get to wherever"
                    },
                ]}
            />
        </View>
    )
}

export default OnboardingScreen;
