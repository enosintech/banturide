import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { selectIsSignedIn, selectToken, setGlobalLoginError, setToken, setTokenFetched, setUserInfo, setUserDataFetched, setUserDataSet, selectUserDataSet, selectUserDataFetched, setGlobalAuthLoading } from "../../slices/authSlice";
import { getItem, setItem } from "../components/lib/asyncStorage";

export function useAuth() {

  const dispatch = useDispatch();

  const [user, setUser] = useState();

  const token = useSelector(selectToken);
  const isSignedIn = useSelector(selectIsSignedIn);
  const userDataSet = useSelector(selectUserDataSet);
  const userDataFetched = useSelector(selectUserDataFetched);

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
        dispatch(setGlobalAuthLoading(false))
        setUser(false)
      }
      dispatch(setTokenFetched(true))
    } catch (error) {
      dispatch(setGlobalAuthLoading(false))
      dispatch(setGlobalLoginError("An error occured while logging in"))
      setTimeout(() => {
        dispatch(setGlobalLoginError(null))
      }, 5000)
      dispatch(setTokenFetched(true))
      setUser(false)
    }
  };

  const fetchUserData = async () => {
    await getItem("userInfo").then( async (data) => {
      if(data) {
        dispatch(setUserInfo(JSON.parse(data)));
        dispatch(setUserDataFetched(true))
      } else {
        await getUserProfile();
      }
    })
    .catch((error) => {
      dispatch(setGlobalAuthLoading(false))
      dispatch(setGlobalLoginError("An error occured while logging in"))
      setTimeout(() => {
        dispatch(setGlobalLoginError(null))
      }, 5000)
      setUser(false)
    })
  }

  const getUserProfile = async () => {
    console.log("emaail verified finna come now")
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

      if(data.success === false) {
        throw new Error(data.message || data.error)
      } else {   
        await setItem("userInfo", JSON.stringify(data.userData));
        dispatch(setUserDataSet(true))  
      }

    } catch (error) {
      dispatch(setGlobalAuthLoading(false))
      dispatch(setGlobalLoginError(error.message || error.error || "There was a problem logging in"))
      setTimeout(() => {
        dispatch(setGlobalLoginError(null))
      }, 5000)
      setUser(false)
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
      if(userDataFetched){
        dispatch(setGlobalAuthLoading(false))
        setUser(true)
      } else {
        await fetchUserData();
      }
    };

    if(token && token.refreshToken && token.idToken) {
      fetchProfile();
    }

  }, [ token, isSignedIn, userDataFetched, userDataSet ])

  return {
    user,
  };

}