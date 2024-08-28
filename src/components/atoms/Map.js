import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, Text, Image, Dimensions } from 'react-native';
import { useEffect, useRef  } from 'react'
import { useSelector } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import LottieView from "lottie-react-native";

import { selectBooking, selectDestination, selectOrigin, selectPassThrough } from '../../../slices/navSlice';
import { lightModeMapStyle, darkModeMapStyle } from '../../../assets/styles/MapStyles.js';

const { width } = Dimensions.get("window")

const Map = (props) => {
  const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const mapRef = useRef(null);
  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination); 
  const booking = useSelector(selectBooking);

  const fontSize = width * 0.05;

  useEffect(() => {

    if(!origin || !destination) return;

    if(booking?.status !== "ongoing" && booking?.status !== "arrived"){
      mapRef.current?.fitToSuppliedMarkers(['origin', 'stop' , 'destination'], {
          edgePadding: {top: 200, right: 100, bottom: 350, left: 100}
      })
    } else {
      mapRef.current?.animateToRegion({
        latitude: booking?.driverCurrentLocation[0],
        longitude: booking?.driverCurrentLocation[1],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }, 1 * 1000)
    }
  }, [origin, destination, booking])

  return (
    <View className="flex-1">
      { props.initialRegion ? (
        <MapView
          ref={(el) => {
            mapRef.current = el;
            props.mapRef.current = el;
          }}
          initialRegion={props.initialRegion}
          provider={PROVIDER_GOOGLE}
          className="flex-1" 
          showsUserLocation={true}
          customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
        > 

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

