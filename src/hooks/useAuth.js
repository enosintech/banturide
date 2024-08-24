import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { selectIsSignedIn, selectToken, selectTokenFetched, setGlobalLoginError, setToken, setTokenFetched, setUserInfo, setUserDataFetched, setUserDataSet, selectUserDataSet, selectUserDataFetched, setGlobalAuthLoading } from "../../slices/authSlice";
import { getItem, setItem } from "../components/lib/asyncStorage";

export function useAuth() {

  const dispatch = useDispatch();

  const [user, setUser] = useState();

  const token = useSelector(selectToken);
  const isSignedIn = useSelector(selectIsSignedIn);
  const tokenFetched = useSelector(selectTokenFetched);
  const userDataSet = useSelector(selectUserDataSet);
  const userDataFetched = useSelector(selectUserDataFetched);

  const retrieveTokens = async () => {
    try {
      const result = await SecureStore.getItemAsync('tokens');
      if (result) {
        const resultData = JSON.parse(result);
        console.log("even here")
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
      dispatch(setTokenFetched(true))
      setUser(false)
    }
  };

  const fetchUserData = async () => {
    await getItem("userInfo").then( async (data) => {
      if(data) {
        console.log("in async")
        dispatch(setUserInfo(JSON.parse(data)));
        dispatch(setUserDataFetched(true))
      } else {
        console.log("going online")
        await getUserProfile();
      }
    })
    .catch((error) => {
      dispatch(setGlobalAuthLoading(false))
      dispatch(setGlobalLoginError("An error occured while logging in"))
      setUser(false)
    })
  }

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

      if(data.success === false) {
        dispatch(setGlobalAuthLoading(false))
        dispatch(setGlobalLoginError(data.message))
        setUser(false)
      } else {   
        await setItem("userInfo", JSON.stringify(data.userData));
        dispatch(setUserDataSet(true))  
      }

    } catch (error) {
      if(!user){
        setUser(false)
      }
    }
  };

  useEffect(() => {
    console.log("and here")
    const fetchTokens = async () => {
      console.log("heretoo")
      await retrieveTokens();
    };
    fetchTokens();
  }, [isSignedIn]);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("reached")
      if(userDataFetched){
        console.log("this")
        dispatch(setGlobalAuthLoading(false))
        setUser(true)
      } else {
        console.log("that")
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