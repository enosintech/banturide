import { View, Image, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

import { selectDestination, selectOrigin, selectPassThrough } from '../../../slices/navSlice';
import { darkModeMapStyle, lightModeMapStyle } from '../../../assets/styles/MapStyles';

const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

const SmallMap = (props) => {
    const origin = useSelector(selectOrigin);
    const passThrough = useSelector(selectPassThrough);
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
            waypoints={[passThrough ? passThrough?.description : "" ]}
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
            >
              <View className={`w-5 h-5 shadow-md rounded-full bg-white flex items-center justify-center`}>
                <Text style={{fontFamily: "os-light"}} className={`text-black text-[12px]`}>1</Text>
              </View>
            </Marker>
          )}

          {passThrough?.location && (
            <Marker
              coordinate={{
                latitude: passThrough.location.lat,
                longitude: passThrough.location.lng,
              }}
              title="1st Stop"
              description={passThrough.description}
              identifier="stop"
            >
              <View className={`w-5 h-5 shadow-md rounded-full bg-[#186f65] flex items-center justify-center`}>
                <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>2</Text>
              </View>
            </Marker>
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
              <View className={`w-5 h-5 shadow-md rounded-full bg-black flex items-center justify-center`}>
                <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>{passThrough ? 3 : 2}</Text>
              </View>
            </Marker>
          )}
      </MapView>
    </View>
  )
}

export default SmallMap;