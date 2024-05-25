import { View, Image } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { useSelector } from 'react-redux';

import { darkModeMapStyle, lightModeMapStyle } from '../../../assets/styles/MapStyles';
import { selectOrigin } from '../../../slices/navSlice';

const RequestMap = (props) => {

  const origin = useSelector(selectOrigin);

  return (
    <View className={`relative w-full h-full`}>
        <MapView
            ref={props.mapRef}
            className="w-full h-full"
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={{
              latitude: origin?.location.lat,
              longitude: origin?.location.lng,
              latitudeDelta: 0.010,
              longitudeDelta: 0.010
            }}
            customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
        >
        </MapView>
    </View>
  )
}

export default RequestMap;