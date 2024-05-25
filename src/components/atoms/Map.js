import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import LottieView from "lottie-react-native";

import { GOOGLE_API_KEY } from "@env";

import { selectDestination, selectOrigin, selectPassThrough } from '../../../slices/navSlice';
import { lightModeMapStyle, darkModeMapStyle } from '../../../assets/styles/MapStyles.js';

const Map = (props) => {
  const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const mapRef = useRef(null);
  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination); 

  useEffect(() => {

    if(!origin || !destination) return;

    mapRef.current?.fitToSuppliedMarkers(['origin', 'stop' , 'destination'], {
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
                waypoints={[passThrough ? passThrough?.description : ""]}
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
              <View className={`w-5 h-5 shadow-md rounded-full bg-black border-black flex items-center justify-center`}>
                <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>{passThrough ? 3 : 2}</Text>
              </View>
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

