import { useContext, useEffect, useState } from "react";
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
        setGroupUsers(prevState => ({...prevState, [username]: { isTyping: true, groupId: selectedRoomId } }));
        setTimeout(() => setGroupUsers(prevState => ({...prevState, [username]: { isTyping: false, groupId: selectedRoomId }})), 700);
    }

    const debouncedTyping = useDebounce(onUserTypingStatusChange, 300);

    const fetchGroupUsers = async () => {

        const group = doc(db, 'chatRooms', selectedRoomId);

        const docs = await getDoc(group);

        setGroupUsers(docs.data().members.reduce((a, v) => ({ ...a, [v]: {isTyping: false, groupId: selectedRoomId} }), {}));
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