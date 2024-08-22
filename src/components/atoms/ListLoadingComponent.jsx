import { View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const ListLoadingComponent = (props) => {
    
    const fontSize = width * 0.05;

    return (
        <View style={{width: 390}} className="flex pt-4 h-full items-center justify-center">
            <Text style={{fontSize: fontSize * 0.65}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.element === "loading" ? "Loading" : "No Results Found"}</Text>
        </View>
    )
}

export default ListLoadingComponent;