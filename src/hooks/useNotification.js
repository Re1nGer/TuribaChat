import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import useSignalR from './useSignalR';

const useNotification = () => {

    const [groupNotifications, setGroupNotifications] = useState([]);

    const { currentUser } = useContext(AuthContext);

    const { connection } = useSignalR();

    const fetchGroups = () => {
        if (currentUser?.uid) {
            const querySnapshot = query(collection(db, 'chatRooms'), where('members', 'array-contains', currentUser.uid));
            onSnapshot(querySnapshot, (snap) => {

                const { docs } = snap;

                const groups = docs.map(group => ({id: group.id, ...group.data()}))

                setGroupNotifications(prevState => ({...prevState, ...groups.reduce((a,v) => ({...a, [v.id]: 0}), {})}));
            });
        }
    }

    useEffect(() => {
        fetchGroups();
    },[currentUser?.uid])

    useEffect(() => {
        if (connection) {
                connection.on("ReceiveNotification", (groupId) => {
                    setGroupNotifications(prevState => ({...prevState, [groupId]: prevState[groupId] + 1}))
                });
            }
    },[connection])

    return {
        groupNotifications
    }

}
export default useNotification;