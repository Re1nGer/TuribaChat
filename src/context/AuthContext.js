import React, { useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import * as signalR from "@microsoft/signalr";


export const AuthContext = React.createContext();

export const AuthContextProvider = ({children}) => {

    const [currentUser, setCurrentUser] = React.useState({});

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const [selectedRoomId, setSelectedRoomId] = React.useState('');

    const [selectedMessage, setSelectedMessage] = React.useState();

    const [connection, setConnection] = useState();

    React.useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setIsLoggedIn(user ? true : false);
        });
        return unsubsribe;
    },[])

    React.useEffect(() => {
        const connect = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5259/Chat')
            .withAutomaticReconnect()
            .build();
    
        setConnection(connect);

    },[])

    const value = {
        selectedMessage,
        setSelectedMessage,
        isLoggedIn,
        selectedRoomId,
        setSelectedRoomId,
        currentUser,
        connection
    };

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>)

}