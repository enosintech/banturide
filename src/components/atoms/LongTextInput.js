import { TextInput, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const LongTextInput = (props) => {

    const fontSize = width * 0.05;

    return (
        <TextInput
            className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[20%] w-[90%] border-[0.25px] border-solid rounded-[25px] p-2 px-4 font-bold tracking-tight`} 
            placeholder={props.placeholder}
            onChangeText={props.handleTextChange}
            onPressIn={props.dismissGenderToggle}
            defaultValue={props.text}
            style={{fontSize: fontSize * 0.8}}
            placeholderTextColor={"rgb(156 163 175)"}
            textContentType={props.type}
        />
    )
}

export default LongTextInput;