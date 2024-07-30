import { useEffect, useState } from 'react'
import messaging from "@react-native-firebase/messaging";

export const useFetchFcmToken = () => {

    const [ token, setToken ] = useState();

    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }

    const registerForPushNotificationsAsync = async () => {
        
        requestUserPermission();

        messaging()
        .getToken()
        .then(token => {
          console.log('FCM Token:', token);
          setToken(token)
        })
        .catch(error => {
          console.error('Failed to fetch FCM token:', error);
        });

    };

    useEffect(() => {
        requestUserPermission();

        messaging()
        .getToken()
        .then(token => {
          console.log('FCM Token:', token);
          setToken(token)
        })
        .catch(error => {
          console.error('Failed to fetch FCM token:', error);
        });

        return messaging().onTokenRefresh(token => {
          console.log('FCM Token refreshed:', token);
          setToken(token)
        });
    }, [])

  return {
    token
  }
  
}
