import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useSignalR = () => {

    const [usersTypingStatus, setUsersTypingStatus] = useState([]);

    const [usersOnlineStatus, setUsersOnlineStatus] = useState([]);

    const [isUserTyping, setIsUserTyping] = useState(false);

    //an object which contains groupIds as keys and values as number of unread messages
    const [groupNotifications, setGroupNotifications] = useState({});

    const { connection } = useContext(AuthContext);

    useEffect(() => {
        if (connection && connection.state === "Disconnected") {
            connection.start()
            .catch(error => console.log(error));
        }
        return () => connection?.stop();
    },[])

    return {
        connection,
        usersOnlineStatus,
        usersTypingStatus,
        groupNotifications,
        isUserTyping,
        setIsUserTyping
    }
}

export default useSignalR;