import { TextInput, PixelRatio } from "react-native";

const LongTextInput = (props) => {

    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return (
        <TextInput
            className={`${props.theme === "dark" ? "bg-gray-500 text-white border-gray-900" : "bg-white text-black border-gray-400"} h-[20%] w-[85%] border-[0.25px] border-solid rounded-xl p-2 font-bold tracking-tight`} 
            placeholder={props.placeholder}
            onChangeText={props.handleTextChange}
            onPressIn={props.dismissGenderToggle}
            defaultValue={props.text}
            style={{fontSize: getFontSize(15)}}
            placeholderTextColor={"rgb(156 163 175)"}
            textContentType={props.type}
        />
    )
}

export default LongTextInput;