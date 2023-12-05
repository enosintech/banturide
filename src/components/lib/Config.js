import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBvICLlasythR7dG3lsCg4zvP-3YyoMLNs",
    authDomain: "banturide-3d9f1.firebaseapp.com",
    projectId: "banturide-3d9f1",
    storageBucket: "banturide-3d9f1.appspot.com",
    messagingSenderId: "436586189975",
    appId: "1:436586189975:web:fe474439bb1367a79585d2"
};

const app = initializeApp(firebaseConfig);

initializeAuth( app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const auth = getAuth(app);

export { auth };