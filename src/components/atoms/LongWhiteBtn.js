import {Text, TouchableOpacity} from "react-native";

const LongWhiteBtn = (props) => {
    return(
            <TouchableOpacity className="bg-[#fff] shadow-lg w-[85%] h-[25%] rounded-2xl flex justify-center items-center" onPress={props.handlePress}>
                <Text style={{fontFamily: "os-b"}} className="text-[#186f65] text-[17px]">{props.value}</Text>
            </TouchableOpacity>
    )
}

export default LongWhiteBtn;