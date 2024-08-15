import { Text, TouchableOpacity, PixelRatio } from "react-native";

const LongGreenBtn = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
            <TouchableOpacity className="bg-[#186F65] shadow-sm w-[85%] h-[25%] rounded-[50px] flex justify-center items-center" onPress={props.handlePress}>
                <Text style={{fontSize: getFontSize(20)}} className="text-white font-bold tracking-tight">{props.value}</Text>
            </TouchableOpacity>
    )
}

export default LongGreenBtn;