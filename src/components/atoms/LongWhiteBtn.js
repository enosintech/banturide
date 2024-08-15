import {Text, TouchableOpacity, Dimensions} from "react-native";

const { width } = Dimensions.get("window");

const LongWhiteBtn = (props) => {

    const fontSize = width * 0.05;

    return(
            <TouchableOpacity className="bg-[#fff] shadow-sm border-gray-100 border-[0.5px] w-[85%] h-[25%] rounded-[50px] flex justify-center items-center" onPress={props.handlePress}>
                <Text style={{fontSize: fontSize * 0.9}} className="text-[#186f65] font-bold tracking-tight">{props.value}</Text>
            </TouchableOpacity>
    )
}

export default LongWhiteBtn;