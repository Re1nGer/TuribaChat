import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const useSignalR = () => {

    const [usersTypingStatus, setUsersTypingStatus] = useState([]);

    const [usersOnlineStatus, setUsersOnlineStatus] = useState([]);

    const [groupUsers, setGroupUsers]  = useState([]);

    const { connection, selectedRoomId } = useContext(AuthContext);

    const onUserTypingStatusChange = async (username) => {
        if (!usersTypingStatus.includes(username))
            setUsersTypingStatus(prevState => [...prevState, username]);

        setTimeout(() => setUsersTypingStatus(prevState => [...prevState.filter(item => item !== username)]), 100);
    }

    const fetchGroupUsers = async () => {
        const group = doc(db, 'chatRooms', selectedRoomId);

        const docs = await getDoc(group);

        setGroupUsers(docs.data().members);
    }

    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                connection.on("ReceiveTypingStatus", (username) => {
                    onUserTypingStatusChange(username);
                });
                })
            .catch((error) => console.log(error));
        }

    },[connection])

    useEffect(() => {

        if (selectedRoomId)
            fetchGroupUsers();

    },[selectedRoomId])

    return {
        connection,
        usersOnlineStatus,
        usersTypingStatus,
        groupUsers
    }
}

export default useSignalR;