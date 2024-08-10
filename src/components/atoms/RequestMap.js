import { useEffect, useState } from 'react';
import { View, Image, PixelRatio, Text } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

import { darkModeMapStyle, lightModeMapStyle } from '../../../assets/styles/MapStyles';
import { selectBooking, selectOrigin } from '../../../slices/navSlice';

const RequestMap = (props) => {

  const origin = useSelector(selectOrigin);
  const booking = useSelector(selectBooking);

  const api="AIzaSyBXqjZCksjSa5e3uFEYwGDf9FK7fKrqCrE";

  const fontScale = PixelRatio.getFontScale();

  const getFontSize = size => size / fontScale;

  const [ driverLocation, setDriverLocation ] = useState(booking && booking?.driverCurrentLocation ? {
    latitude: booking?.driverCurrentLocation[0],
    longitude: booking?.driverCurrentLocation[1]
  } : {
    latitude: "",
    longitude: ""
  })

  useEffect(() => {
    setDriverLocation( booking && booking?.driverCurrentLocation ? {
      latitude: booking?.driverCurrentLocation[0],
      longitude: booking?.driverCurrentLocation[1]
    } : {
      latitude: origin?.location?.lat,
      longitude: origin?.location?.lng
    })
  }, [booking])

  const pointA = { latitude: driverLocation?.latitude, longitude: driverLocation?.longitude }; 
  const pointB = { latitude: booking?.pickUpLocation?.latitude, longitude: booking?.pickUpLocation?.longitude }; 

  const midPoint = {
      latitude: (pointA.latitude + pointB.latitude) / 2,
      longitude: (pointA.longitude + pointB.longitude) / 2,
  };

  const latitudeDelta = Math.abs(pointA.latitude - pointB.latitude) * 2;
  const longitudeDelta = Math.abs(pointA.longitude - pointB.longitude) * 2;

  const confirmedBookingInitialRegion = {
    latitude: midPoint.latitude,
    longitude: midPoint.longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  }

  const ongoingBookingInitialRegion = {
    latitude: booking && booking?.driverCurrentLocation ? booking?.driverCurrentLocation[0] : "",
    longitude: booking && booking?.driverCurrentLocation ? booking?.driverCurrentLocation[1] : "",
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  }

  const arrivedBookingInitialRegion = {
    latitude: midPoint.latitude,
    longitude: midPoint.longitude,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  }

  return (
    <View className={`relative w-full h-full`}>
        <MapView
            ref={props.mapRef}
            className="w-full h-full"
            initialRegion={ booking?.status === "confirmed" ? confirmedBookingInitialRegion : booking?.status === "ongoing" ? ongoingBookingInitialRegion : booking?.status === "arrived" ? arrivedBookingInitialRegion : {
              latitude: origin?.location?.lat,
              longitude: origin?.location?.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
            customMapStyle={props.theme === "dark" ? darkModeMapStyle : lightModeMapStyle}
        >
          {booking && booking?.status === "confirmed" &&
            <>
              <MapViewDirections 
                  origin={{
                    latitude: driverLocation?.latitude,
                    longitude: driverLocation?.longitude
                  }}
                  destination={{
                    latitude: booking?.pickUpLocation?.latitude,
                    longitude: booking?.pickUpLocation?.longitude
                  }}
                  apikey={api}
                  strokeWidth={3}
                  strokeColor= {props.theme === "dark" ? "white" : "black"}
              />

              <Marker 
                coordinate={{
                  latitude: driverLocation?.latitude,
                  longitude: driverLocation?.longitude,
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

              <Marker 
                coordinate={{
                  latitude: booking?.pickUpLocation?.latitude,
                  longitude: booking?.pickUpLocation?.longitude,
                }}
                title="Origin"
                description={origin.description}
                identifier="origin"
              >
                <View className={`w-14 h-14 shadow-md rounded-full bg-white flex items-center justify-center`}>
                  <Text style={{fontSize: getFontSize(25)}} className={`text-black font-light tracking-tight`}>1</Text>
                </View>
              </Marker>
            </>
          }


        </MapView>
    </View>
  )
}

export default RequestMap;