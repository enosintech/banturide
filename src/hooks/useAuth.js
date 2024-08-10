import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { selectIsSignedIn, selectToken, selectTokenFetched, setToken, setTokenFetched, setUserInfo } from "../../slices/authSlice";

import { selectProfileUpdated } from "../../slices/navSlice";

export function useAuth() {

  const dispatch = useDispatch();

  const [user, setUser] = useState();

  const token = useSelector(selectToken);
  const isSignedIn = useSelector(selectIsSignedIn);
  const profileUpdated = useSelector(selectProfileUpdated);
  const tokenFetched = useSelector(selectTokenFetched)

  const retrieveTokens = async () => {
    try {
      const result = await SecureStore.getItemAsync('tokens');
      if (result) {
        const resultData = JSON.parse(result);
        dispatch(setToken({
          idToken: resultData.idToken,
          refreshToken: resultData.refreshToken,
        }));
      } else {
        console.log('No token found');
      }
      dispatch(setTokenFetched(true))
    } catch (error) {
      console.log('Error retrieving token', error);
      dispatch(setTokenFetched(true))
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch("https://banturide-api.onrender.com/profile/get-user-profile", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.idToken}`,
          'x-refresh-token': token.refreshToken,
        }
      });
      const data = await response.json();
      
      if (data.error) {
        dispatch(setUserInfo(null));
        setUser(false);
        console.log(data);
      } else {
        dispatch(setUserInfo(data));
        setUser(true);
        console.log(data);
      }
    } catch (error) {
      console.log("There was an error while fetching User Profile:", error);
      if(!user){
        setUser(false)
      }
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      await retrieveTokens();
    };
    fetchTokens();
  }, [isSignedIn]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token && token.refreshToken && token.idToken) {
        await getUserProfile();
      } else {
        setUser(false);
      }
    };

    if(tokenFetched){
      fetchProfile();
    }

  }, [tokenFetched, token, isSignedIn, profileUpdated]);

  return {
    user,
  };

}