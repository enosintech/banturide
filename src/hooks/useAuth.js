import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { selectUser, setUser } from "../../slices/authSlice";
import { auth } from "../components/lib/Config";

export function useAuth () {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    useEffect(() => {
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser(user));
            } else {
                dispatch(setUser(null))
            }
        });

        return unsubscribeFromAuthStatusChanged;
    }, [])

  return {
    user
  };
}