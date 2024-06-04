import { View, Text, PixelRatio } from 'react-native'

const ListLoadingComponent = (props) => {
    const fontScale = PixelRatio.getFontScale();

    const getFontSize = size => size / fontScale;

    return (
        <View style={{width: getFontSize(390)}} className="flex pt-4 h-full items-center justify-center">
            <Text style={{fontSize: getFontSize(16)}} className={`font-light tracking-tight ${props.theme === "dark" ? "text-white" : "text-black"}`}>{props.element === "loading" ? "Loading" : "No Results Found"}</Text>
        </View>
    )
}

export default ListLoadingComponent;