import {Text, TouchableOpacity, PixelRatio} from "react-native";

const LongWhiteBtn = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return(
            <TouchableOpacity className="bg-[#fff] shadow-lg border-gray-100 border-[0.5px] w-[85%] h-[25%] rounded-[25px] flex justify-center items-center" onPress={props.handlePress}>
                <Text style={{fontSize: getFontSize(15)}} className="text-[#186f65] font-bold tracking-tight">{props.value}</Text>
            </TouchableOpacity>
    )
}

export default LongWhiteBtn;