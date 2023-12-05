import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import LottieView from "lottie-react-native";

api="AIzaSyDCK1kGQBTjZ3-KWP5I7Q4AQQ3DCTEv060"

import { selectDestination, selectOrigin } from '../../../slices/navSlice';
import { lightModeMapStyle, darkModeMapStyle } from '../../../assets/styles/MapStyles.js';

const Map = (props) => {
  const mapRef = useRef(null)
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination) 

  useEffect(() => {
    if(!origin || !destination) return;

    mapRef.current?.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
    })
  }, [origin, destination])

  return (
    <View className="flex-1">
      { props.initialRegion ? (
        <MapView
          ref={(el) => {
            mapRef.current = el;
            props.mapRef.current = el;
          }}
          initialRegion={props.initialRegion}
          className="flex-1" 
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
        > 

          {origin && destination && 
            <MapViewDirections 
                origin={origin.description}
                destination={destination.description}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "black"}
            />
          }

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
      ) : 
      <View className="flex-1">
        <View className={`w-full h-[75%] items-center justify-center ${props.theme === "dark" ? "bg-[#222831]" : "bg-gray-100"}`}>
          <LottieView
            source={require("../../../assets/animations/mapload.json")} 
            loop
            autoPlay
            speed={2}
            style={{
              width: 250,
              height: 250
            }}
          />
        </View>
      </View>}
    </View>
  )
}

export default Map;

