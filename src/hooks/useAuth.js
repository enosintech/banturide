import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";

import { selectIsSignedIn, setUserInfo } from "../../slices/authSlice";
import { selectProfileUpdated } from "../../slices/navSlice";

export function useAuth () {

  const dispatch = useDispatch();

  const [userData, setUserData] = useState({})
  const [user, setUser] = useState("")

  const userIsSignedIn = useSelector(selectIsSignedIn);
  const profileUpdated = useSelector(selectProfileUpdated);

  const getUserData = async () => {
    await SecureStore.getItemAsync("user").then((data) => {
        const responseData = JSON.parse(data);
        setUserData(responseData)
    }).catch((err) => {
        console.log(err)
    });
  }

  useEffect(() => {
    const fetchProfileInfo = async () => {
        try{
            const response = await fetch(`https://banturide.onrender.com/profile/profile/${userData?.user?._id}`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            })

            const result = await response.json();
            dispatch(setUserInfo(result))
        } catch (error) {
            console.log(error)
        }
    }

    fetchProfileInfo()
  }, [userData, profileUpdated])

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