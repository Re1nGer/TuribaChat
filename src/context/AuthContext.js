import React from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";


export const AuthContext = React.createContext();

export const AuthContextProvider = ({children}) => {

    const [currentUser, setCurrentUser] = React.useState({});

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const [selectedRoomId, setSelectedRoomId] = React.useState('');

    React.useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setIsLoggedIn(user ? true : false);
        });
        return unsubsribe;
    },[])

    const value = {
        isLoggedIn,
        selectedRoomId,
        setSelectedRoomId,
        currentUser
    };

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)

}