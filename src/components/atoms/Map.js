import { useEffect, useRef  } from 'react'
import { View, Text, PixelRatio, Image } from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import LottieView from "lottie-react-native";

import { selectBooking, selectDestination, selectOrigin, selectPassThrough } from '../../../slices/navSlice';
import { lightModeMapStyle, darkModeMapStyle } from '../../../assets/styles/MapStyles.js';

const Map = (props) => {
  const api = "AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const mapRef = useRef(null);
  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination); 
  const booking = useSelector(selectBooking);

  const fontScale = PixelRatio.getFontScale();

  const getFontSize = size => size / fontScale;

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
          initialRegion={booking?.status !== "ongoing" && booking?.status !== "arrived" ? props.initialRegion : {
            latitude: booking?.driverCurrentLocation[0],
            longitude: booking?.driverCurrentLocation[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          className="flex-1" 
          showsUserLocation={true}
          customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
        > 
          {origin && destination && (booking?.status !== "ongoing" || booking?.status !== "arrived" ) &&
            <MapViewDirections 
                origin={origin.description}
                destination={destination.description}
                waypoints={[passThrough ? passThrough?.description : ""]}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "black"}
            />
          }

          {(booking?.status === "ongoing" || booking?.status === "arrived") &&
          <>
            <MapViewDirections 
                origin={{
                    latitude: booking?.driverCurrentLocation[0],
                    longitude: booking?.driverCurrentLocation[1]
                }}
                destination={destination.description}
                waypoints={[passThrough ? passThrough?.description : ""]}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "#186f65"}
            />

            <Marker 
                coordinate={{
                  latitude: booking?.driverCurrentLocation[0],
                  longitude: booking?.driverCurrentLocation[1]
                }}
                title="Driver"
                description={"Driver Marker"}
                identifier="driver"
              >
                <Image 
                  source={require("../../../assets/images/driver.png")}
                  style={{
                      objectFit: "contain",
                      width : getFontSize(55),
                      height: getFontSize(55),
                  }}
                />
              </Marker>
              </>
          }

          {origin?.location && (booking?.status !== "ongoing" || booking?.status !== "arrived" ) && (
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
                <Text style={{fontSize: getFontSize(12)}} className={`text-black font-light tracking-tight`}>1</Text>
              </View>
            </Marker>
          )}
          
          {passThrough?.location && (booking?.status !== "ongoing" || booking?.status !== "arrived" ) &&  (
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
                <Text style={{fontSize: getFontSize(12)}} className={`text-white font-light tracking-tight`}>2</Text>
              </View>
            </Marker>
          )}

          {destination?.location &&  (
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
                <Text style={{fontSize: getFontSize(12)}} className={`text-white font-light tracking-tight`}>{passThrough ? 3 : 2}</Text>
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

