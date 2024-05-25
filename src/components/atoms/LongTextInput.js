import { TextInput } from "react-native";

const LongTextInput = (props) => {
    return (
        <TextInput
            className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[20%] w-[85%] border-[0.25px] border-solid rounded-xl text-[15px] p-2`} 
            placeholder={props.placeholder}
            onChangeText={props.handleTextChange}
            onPressIn={props.dismissGenderToggle}
            defaultValue={props.text}
            style={{fontFamily: "os-sb"}}
            placeholderTextColor={"rgb(156 163 175)"}
        />
    )
}

export default LongTextInput;