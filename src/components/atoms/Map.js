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
          {
            booking?.status === "pending" && origin?.location &&
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
            booking?.status === "pending" && booking?.hasThirdStop && passThrough?.locationn &&
            (
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
            )
          }

          {
            booking?.status === "pending" && destination?.location &&
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
                <Text style={{fontFamily: "os-light"}} className={`text-white text-[12px]`}>{booking?.hasThirdStop ? 3 : 2}</Text>
              </View>
            </Marker>
            )
          }

          {
            booking?.status === "pending" && origin?.location && destination?.location && !booking?.hasThirdStop && (
              <MapViewDirections 
                origin={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng
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
            booking?.status === "pending" && origin?.location && destination?.location && passThrough?.location && booking?.hasThirdStop && (
              <MapViewDirections 
                origin={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng
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

