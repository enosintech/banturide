import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { selectIsSignedIn, selectToken, setToken, setUserInfo } from "../../slices/authSlice";

import { selectProfileUpdated } from "../../slices/navSlice";

export function useAuth () {

  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const isSignedIn = useSelector(selectIsSignedIn);
  const profileUpdated = useSelector(selectProfileUpdated);
  const [ user, setUser ] = useState();

  const retrieveTokens = async () => {
    try {
      const result = await SecureStore.getItemAsync('tokens');
      if (result) {
        const resultData = JSON.parse(result);

        dispatch(setToken({
          idToken: resultData.idToken,
          refreshToken: resultData.refreshToken,
        }))

      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error retrieving token', error);
    }
  }

  const getUserProfile = async () => {
    try {
      await fetch("https://banturide-api.onrender.com/profile/get-user-profile", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.idToken}`,
          'x-refresh-token' : token.refreshToken,
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if('error' in data){
          console.log(data)
          dispatch(setUserInfo(null))
          setUser(false)
        } else {
          dispatch(setUserInfo(data))
          setUser(true)
        }
      })

    } catch (error) { 
      console.log("There was an error while fetching User Profile:", error)
    }
  }

  useEffect(() => {
    retrieveTokens();
  }, [isSignedIn])

  useEffect(() => {
    if(token?.idToken){
      getUserProfile();
    } else {
      setUser(false)
    }
  }, [token, isSignedIn, profileUpdated])
  
  return {
    user
  };
}