import {Text, TouchableOpacity} from "react-native";

const LongGreenBtn = (props) => {
    return(
            <TouchableOpacity className="bg-[#186F65] shadow-lg w-[85%] h-[25%] rounded-2xl flex justify-center items-center" onPress={props.handlePress}>
                <Text style={{fontFamily: "os-b"}} className="text-[17px] text-white">{props.value}</Text>
            </TouchableOpacity>
    )
}

export default LongGreenBtn;