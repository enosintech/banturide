import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";

import { selectIsSignedIn, setUserInfo } from "../../slices/authSlice";

export function useAuth () {

  const dispatch = useDispatch();

  const [userData, setUserData] = useState({})
  const [user, setUser] = useState("")

  const userIsSignedIn = useSelector(selectIsSignedIn);

  const getUserData = async () => {
    await SecureStore.getItemAsync("user").then((data) => {
        const responseData = JSON.parse(data);
        setUserData(responseData)
    }).catch((err) => {
        console.log(err)
    });
  }

  useEffect(() => {
    dispatch(setUserInfo(userData))
  }, [userData])

  useEffect(() => {
      getUserData();
  }, [userIsSignedIn])

  useEffect(() => {
    if(userData !== null){
      if(Object.keys(userData).length > 1){
        setUser(Object.keys(userData).includes("token") && userData?.token !== "" ? "signedin" : "signedout")
      }
    } else {
      setUser("signedout")
    }
  }, [userData])
  
  return {
    user
  };
}