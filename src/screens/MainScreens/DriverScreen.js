import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { useRef, useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import RequestMap from '../../components/atoms/RequestMap';
import { selectDestination, selectHasArrived, selectOnTheWay, selectOrigin, selectPassThrough, selectTripType, setPassThrough } from '../../../slices/navSlice';

const DriverScreen = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mapRef = useRef();
  const height = Dimensions.get("window").height;

  const origin = useSelector(selectOrigin);
  const passThrough = useSelector(selectPassThrough);
  const destination = useSelector(selectDestination);
  const hasArrived = useSelector(selectHasArrived);
  const tripType = useSelector(selectTripType);
  const onTheWay = useSelector(selectOnTheWay);

  const [ min, setMin ] = useState(5);

  const currentLocation = {
    latitude: origin?.location.lat,
    longitude: origin?.location.lng,
    latitudeDelta: 0.010,
    longitudeDelta: 0.010
  }

  const goToCurrentLocation = () => {
    mapRef.current.animateToRegion(currentLocation, 1 * 1000);
  }

  return (
    <View className={`w-full h-full`}>
      <View className={`w-full h-full flex`}>
        <ScrollView contentContainerStyle={{
          display: "flex",
          flexDirection: "column"
        }}>
          <View style={{
            height: 0.7 * height
          }} className={`w-full relative`}>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] right-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => {
                    navigation.navigate("Home")
                }}>
                <Ionicons name="chevron-down" size={25} color={`${props.theme === "dark" ? "white" : "black"}`} />
            </TouchableOpacity>
            <TouchableOpacity className={`absolute z-50 bottom-[5%] left-[5%] rounded-2xl shadow-xl ${props.theme === "dark" ? "bg-[#0e1115]" : "bg-white"} h-[40px] w-[40px] items-center justify-center`} onPress={() => goToCurrentLocation()}>
                    <MaterialIcons name="my-location" size={25} color={`${props.theme === "dark" ? "white" : "black"}`}/>
            </TouchableOpacity>
            <RequestMap mapRef={mapRef} theme={props.theme}/>
          </View>
          <View style={{
            height: 0.8 * height
          }} className={`w-full flex items-center justify-start gap-y-4 border-t-4 ${props.theme === "dark" ? "bg-[#0e1115] border-white" : "bg-gray-100 border-gray-200"}`}>
            <View className={`w-[95%] h-[20%] rounded-[20px] flex flex-row items-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
              <View className={`w-2/3 h-full flex-row`}>
                <View className={`w-1/3 h-full flex items-center justify-start pt-7`}>
                  <View className={`w-14 h-14 ${props.theme === "dark" ? "" : "bg-white"} rounded-full shadow-md`}></View>
                </View>
                <View className={`w-2/3 h-full flex items-start justify-center`}>
                  <Text style={{fontFamily: "os-xb"}} className={`text-[20px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>{'Enos '}{'Nsamba'}</Text>
                  <Text style={{fontFamily: "os-mid"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>Red Toyota Prius</Text>
                  <Text style={{fontFamily: "os-light"}} className={`${props.theme === "dark" ? "text-white" : "text-black"}`}>BAE 3155</Text>
                  <View className={`w-[95%] h-[20%] mt-2 rounded-[5px] bg-[#186f65] flex items-center justify-center`}>
                    <Text style={{fontFamily: "os-xb"}} className={`text-white text-[14px]`}>{onTheWay ? "You're on the way" : hasArrived ? "Driver has Arrived" : `Arriving in ${min} mins`}</Text>
                  </View>
                </View>
              </View>
              <View className={`w-0 h-[80%] border-l-[0.5px] flex ${props.theme === "dark" ? "border-white" : "border-gray-300"}` }></View>
              <View className={`w-1/3 h-full flex items-center justify-center`}>
                <TouchableOpacity className={`w-[85%] h-[85%] flex items-center justify-center rounded-[20px] shadow border-[0.5px] ${props.theme === "dark" ? "" : "bg-white border-gray-100"}`} onPress={() => {
                  onTheWay 
                  ? 
                    console.log("You're on the way")
                  :
                  navigation.navigate("chat");
                }}>
                  {
                    onTheWay
                    ?
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <MaterialIcons name="star-rate" size={35} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontFamily: "os-sb"}} className={`text-[14px] text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Rate Ride</Text>
                    </View>
                    :
                    <View className={`w-[70%] h-[70%] flex items-center justify-center`}>
                      <Ionicons name="chatbubbles" size={35} color={props.theme === "dark" ? "white" : "black"}/>
                      <Text style={{fontFamily: "os-sb"}} className={`text-[14px] text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Contact Driver</Text>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View className={`w-[95%] h-[40%] rounded-[20px] flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
              <View className={`w-[90%] flex items-center justify-between h-[90%]`}>
                <View className={`w-full h-1/3 flex-row items-center rounded-[16px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                  <View className={`w-[20%] h-full flex items-center justify-center`}>
                    <MaterialIcons name="trip-origin" size={35} color={props.theme === "dark" ? "white" : "black"}/>
                  </View>
                  <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                  <View className={`w-[80%] h-full flex pr-5`}>
                    <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                      <Text style={{fontFamily: "os-xb"}} className={`text-[20px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Origin</Text>
                    </View>
                    <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                      <Text style={{fontFamily: "os-light"}} className={`text-[22px] ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{origin?.description.split(",")[0]}</Text>
                    </View>
                  </View>
                </View>
                  {
                    tripType === "normal"
                    ?
                    <View className={`w-full h-2/3 flex`}>
                      {
                        passThrough 
                        ?
                        <View className={`w-full h-1/2 flex-row`}>
                          <View className={`w-[60%] h-full flex items-center justify-center`}>
                            <View className={`w-full h-1/2 flex flex-row items-center justify-center`}>
                              <MaterialIcons name="keyboard-arrow-right" size={25} color={props.theme === "dark" ? "white" : "black"}/>
                              <Text style={{fontFamily: "os-xb"}} className={`text-[18px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Stop</Text>
                              <MaterialIcons name="keyboard-arrow-right" size={25} color={props.theme === "dark" ? "white" : "black"}/>
                            </View>
                            <View className={`w-[80%] h-0 border-t-[0.5px] ${props.theme === "dark" ? "border-gray-100" : "border-gray-300"}`}></View>
                            <Text style={{fontFamily: "os-light"}} className={`text-[12px] text-center w-[80%] mt-1 h-1/2 truncate ${props.theme === "dark" ? "text-white" : "text-black"}`}>{passThrough.description.split(",")[0]}</Text>
                          </View>
                          <View className={`w-[40%] h-full flex items-end justify-center pr-5`}>
                            <TouchableOpacity className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`} onPress={() => {
                              dispatch(setPassThrough(null))
                            }}>
                              <Text style={{fontFamily: "os-mid"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Remove</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        :
                        <View className={`w-full h-1/2 flex items-center justify-center`}>
                          <TouchableOpacity className={`p-2 rounded-full border-[0.5px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white shadow border-gray-100"}`} onPress={() => {
                            navigation.navigate("addStop")
                          }}>
                            <Text style={{fontFamily: "os-mid"}} className={`text-[15px] ${props.theme === "dark" ? "text-white" : "text-black"}`}>Add Stop</Text>
                          </TouchableOpacity>
                        </View>
                      }
                      <View className={`w-full h-1/2 flex-row items-center rounded-[16px] ${props.theme === "dark" ? "bg-[#414953] border-gray-700" : "bg-white border-gray-100"} shadow border-[0.5px]`}>
                        <View className={`w-[20%] h-full flex items-center justify-center`}>
                          <FontAwesome name="flag-checkered" size={35} color={props.theme === "dark" ? "white" : "black"}/>
                        </View>
                        <View className={`w-0 h-[80%] border-l ${props.theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></View>
                        <TouchableOpacity className={`w-[80%] h-full flex pr-5`}>
                          <View className={`w-full h-1/2 flex flex-row items-center justify-end`}>
                            <Text style={{fontFamily: "os-xb"}} className={`text-[20px] mr-1 ${props.theme === "dark" ? "text-white" : "text-black"}`}>Destination</Text>
                            <Ionicons name="chevron-forward" size={22} color={props.theme === "dark" ? "white" : "black"} />
                          </View>
                          <View className={`w-full h-1/2 flex flex-row items-start justify-end`}>
                            <Text style={{fontFamily: "os-light"}} className={`text-[22px] ml-2 ${props.theme === "dark" ? "text-white" : "text-black"}`}>{destination?.description.split(",")[0]}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    :
                    <View className={`w-full h-2/3 flex bg-yellow-800`}></View>
                  }
              </View>
            </View>
            <View className={`w-[95%] h-[30%] flex flex-row items-center justify-evenly`}>
              <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                navigation.navigate("changepayment")
              }}>
                <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
                  <Ionicons name="cash" size={30} color="#186f65"/>
                </View>
                <Text style={{fontFamily: "os-mid"}} className={`text-[14px] mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`}>
                <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
                  <Ionicons name="share" size={30} color={props.theme === "dark" ? "white" : "black"}/>
                </View>
                <Text style={{fontFamily: "os-mid"}} className={`text-[14px] mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Share Trip</Text>
              </TouchableOpacity>
              {
                onTheWay
                ?
                  <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`}>
                    <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center ${props.theme === "dark" ? "bg-[#202227]" : "bg-white"}`}>
                      <MaterialIcons name="report" size={35} color={props.theme === "dark" ? "white" : "black"}/>
                    </View>
                    <Text style={{fontFamily: "os-mid"}} className={`text-[14px] mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Report Driver</Text>
                  </TouchableOpacity>
                :
                  <TouchableOpacity className={`w-[100px] h-[100px] flex items-center justify-center`} onPress={() => {
                    navigation.navigate("cancel");
                  }}>
                    <View className={`w-[65px] h-[65px] rounded-full flex items-center justify-center bg-red-100`}>
                      <Entypo name="cross" size={30} color={"rgb(239,68,68)"}/>
                    </View>
                    <Text style={{fontFamily: "os-mid"}} className={`text-[14px] mt-2 text-center ${props.theme === "dark" ? "text-white" : "text-black"}`}>Cancel Ride</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default DriverScreen;
