import { useEffect, useState } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

import { darkModeMapStyle, lightModeMapStyle } from '../../../assets/styles/MapStyles';
import { selectBooking, selectDestination, selectOrigin, selectPassThrough } from '../../../slices/navSlice';

const { width } = Dimensions.get("window");
 
const RequestMap = (props) => {

  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const passThrough = useSelector(selectPassThrough);
  const booking = useSelector(selectBooking);

  const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const fontSize = width * 0.05;

  return (
    <View className={`relative w-full h-full`}>
        <MapView
            ref={props.mapRef}
            className="w-full h-full"
            initialRegion={{
              latitude: origin?.location?.lat,
              longitude: origin?.location?.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
            provider={PROVIDER_GOOGLE}
            customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
        >
          {
            booking?.status === "confirmed" && origin?.location &&
            (
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
            )
          }

          {
            booking?.status === "confirmed" && origin?.location && booking?.driverCurrentLocation && (
              <MapViewDirections 
                origin={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                destination={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng
                }}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "black"}
              />
            )
          }

          {
            booking?.status === "confirmed" && booking?.driverCurrentLocation && (
              <Marker 
                coordinate={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                title="Driver"
                description={"Driver Marker"}
                identifier="driver"
              >
                <Image 
                  source={require("../../../assets/images/driver.png")}
                  style={{
                      objectFit: "contain",
                      width : fontSize * 2.5,
                      height: fontSize * 2.5,
                  }}
                />
              </Marker>
            )
          }

          {
            booking?.status === "ongoing" && destination?.location &&
            (
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
                  <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>{booking?.hasThirdStop ? booking?.reachedThirdStop ? 2 : 3 : 2}</Text>
                </View>
            </Marker>
            )
          }

          {
            booking?.status === "ongoing" && booking?.hasThirdStop && !booking?.reachedThirdStop && passThrough?.location &&
            (
              <Marker 
                coordinate={{
                  latitude: passThrough.location.lat,
                  longitude: passThrough.location.lng,
                }}
                title="Stop"
                description={passThrough.description}
                identifier="stop"
            >
                <View className={`w-5 h-5 shadow rounded-full bg-[#186f65] flex items-center justify-center`}>
                  <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>2</Text>
                </View>
            </Marker>
            )
          }

          {
            booking?.status === "ongoing" && booking?.driverCurrentLocation && (
              <Marker 
                coordinate={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                title="Driver"
                description={"Driver Marker"}
                identifier="driver"
              >
                <Image 
                  source={require("../../../assets/images/driver.png")}
                  style={{
                      objectFit: "contain",
                      width : fontSize * 1.5,
                      height: fontSize * 1.5,
                  }}
                />
              </Marker>
            )
          }

          {
            booking?.status === "ongoing" && booking?.driverCurrentLocation && destination?.location && passThrough?.location && booking?.hasThirdStop && !booking?.reachedThirdStop && (
              <MapViewDirections 
                origin={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                destination={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng
                }}
                waypoints={[{ 
                  latitude: passThrough.location.lat, 
                  longitude: passThrough.location.lng 
                }]}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "black"}
              />
            )
          }

          {
            booking?.status === "ongoing" && booking?.driverCurrentLocation && destination?.location && passThrough?.location && booking?.hasThirdStop && booking?.reachedThirdStop && (
              <MapViewDirections 
                origin={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                destination={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng
                }}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "black"}
              />
            )
          }

          {
            booking?.status === "ongoing" && booking?.driverCurrentLocation && destination?.location && !booking?.hasThirdStop && (
              <MapViewDirections 
                origin={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                destination={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng
                }}
                apikey={api}
                strokeWidth={3}
                strokeColor= {props.theme === "dark" ? "white" : "black"}
              />
            )
          }

          {
            booking?.status === "arrived" && destination?.location &&
            (
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
                  <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>2</Text>
                </View>
            </Marker>
            )
          }

          {
            booking?.status === "arrived" && booking?.driverCurrentLocation && (
              <Marker 
                coordinate={{
                  latitude: booking.driverCurrentLocation[0],
                  longitude: booking.driverCurrentLocation[1]
                }}
                title="Driver"
                description={"Driver Marker"}
                identifier="driver"
              >
                <Image 
                  source={require("../../../assets/images/driver.png")}
                  style={{
                      objectFit: "contain",
                      width : fontSize * 1.5,
                      height: fontSize * 1.5,
                  }}
                />
              </Marker>
            )
          }

        </MapView>
    </View>
  )
}

export default RequestMap;