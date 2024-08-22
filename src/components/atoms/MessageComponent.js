import { View, Text, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function MessageComponent({item, user, theme}) {

    const currentUser = item.senderId === user;

    const fontSize = width * 0.05;

    return (
        <View>
            <View
                style={
                    {
                        alignItems: !currentUser ? "flex-start" : "flex-end"
                    }    
                }
                className={`w-full mb-[15px]`}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {!currentUser &&
                        <Ionicons
                            name='person-circle-outline'
                            size={fontSize * 1.6}
                            color={theme === "dark" ? "white" : "black"}
                        />
                    }
                    <View
                        className={`${!currentUser ? "ml-2" : "mr-2"} max-w-[50%] ${ theme === "dark" ? !currentUser ? "bg-dark-secondary" : "bg-[#186f65]" : !currentUser ? "bg-white" : "bg-[#186f65]" } p-[12px] px-[20px] shadow-sm rounded-[30px] mb-[2px]`}
                    >
                        <Text style={{fontSize: fontSize * 0.7}} className={`${theme === "dark" ? !currentUser ? "text-white" : "text-white" : !currentUser ? "text-black" : "text-white" } font-medium tracking-tight`}>{item.text}</Text>
                    </View>
                    {currentUser &&
                        <Ionicons
                            name='person-circle-outline'
                            size={fontSize * 1.6}
                            color={theme === "dark" ? "white" : "black"}
                            className={`ml-6`}
                        />
                    }
                </View>
                <Text style={{ marginLeft: 40, marginRight: 40, fontSize: fontSize * 0.6 }} className={`${theme === "dark" ? "text-white" : "text-black"} mt-2`}>{item.time}</Text>
            </View>
        </View>
    );
}