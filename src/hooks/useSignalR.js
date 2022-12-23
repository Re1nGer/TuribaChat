import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import useDebounce from '../hooks/useDebounce';

const useSignalR = () => {

    const [usersTypingStatus, setUsersTypingStatus] = useState([]);

    const [usersOnlineStatus, setUsersOnlineStatus] = useState([]);

    const [groupUsers, setGroupUsers]  = useState({});

    //an object which contains groupIds as keys and values as number of unread messages
    const [groupNotifications, setGroupNotifications] = useState({});

    const { connection, selectedRoomId, currentUser } = useContext(AuthContext);

    const onUserTypingStatusChange = (username) => {
        setGroupUsers(prevState => ({...prevState, [username]: true}));
        setTimeout(() => setGroupUsers(prevState => ({...prevState, [username]: false})), 700);
    }

    const debouncedTyping = useDebounce(onUserTypingStatusChange, 300);

    const fetchGroupUsers = async () => {

        const group = doc(db, 'chatRooms', selectedRoomId);

        const docs = await getDoc(group);

        setGroupUsers(docs.data().members.reduce((a, v) => ({ ...a, [v]: false }), {}));
    }

    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                connection.on("ReceiveTypingStatus", debouncedTyping);
            }).catch(error => console.log(error));
        }
        return () => connection?.stop();

    },[])

    useEffect(() => {

        if (selectedRoomId) fetchGroupUsers();

    },[selectedRoomId])

    return {
        connection,
        usersOnlineStatus,
        usersTypingStatus,
        groupUsers,
        groupNotifications
    }
}

export default useSignalR;