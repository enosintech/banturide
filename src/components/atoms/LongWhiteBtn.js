import {Text, TouchableOpacity, Dimensions} from "react-native";

const { width } = Dimensions.get("window");

const LongWhiteBtn = (props) => {

    const fontSize = width * 0.05;

    return(
            <TouchableOpacity className="bg-white shadow border-gray-100 border-[0.5px] w-[90%] h-[26%] rounded-[50px] flex justify-center items-center" onPress={props.handlePress}>
                <Text style={{fontSize: fontSize * 1.1}} className="text-[#186f65] font-black tracking-tighter">{props.value}</Text>
            </TouchableOpacity>
    )
}

export default LongWhiteBtn;