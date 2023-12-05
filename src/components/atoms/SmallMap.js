import { View, Image } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

import { selectDestination, selectOrigin } from '../../../slices/navSlice';
import { darkModeMapStyle, lightModeMapStyle } from '../../../assets/styles/MapStyles';



const SmallMap = (props) => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);

    useEffect(() => {
      props.expandMap()
    }, [origin, destination])

  return (
    <View className="w-full h-full">
      <MapView
        ref={props.expandMapRef} 
        className="flex-1"
        showsUserLocation
        provider={PROVIDER_GOOGLE}
        initialRegion={props.initialRegion}
        customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
      >
        {origin && destination && (
          <MapViewDirections 
            origin={origin.description}
            destination={destination.description}
            apikey={api}
            strokeWidth={3}
            strokeColor= {props.theme === "dark" ? "white" : "black"}
          />
        )}

        {origin?.location && (
            <Marker 
              coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
              title="Origin"
              description={origin.description}
              identifier="origin"
            />
          )}

          {destination?.location && (
            <Marker
                coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                }}
                title="Destination"
                description={destination.description}
                identifier="destination"
            >
              <Image 
                source={require("../../../assets/icons/checkered-flag.png")}
                className={`w-[50px] h-[50px] -rotate-45`}
              />
            </Marker>
          )}

      </MapView>
    </View>
  )
}

export default SmallMap;