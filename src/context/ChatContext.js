import { onSnapshot, query, collection, where, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import React from 'react';
import { AuthContext } from './AuthContext';
import { deleteDoc } from "firebase/firestore";


export const ChatContext = React.createContext();

const ChatContextProvider = ({children}) => {

    const [messages, setMessages] = React.useState([]);

    const [groups, setGroups] = React.useState([]);

    const { currentUser, isLoggedIn, selectedRoomId } = React.useContext(AuthContext);


    const cleanupMessages = () => {
        setMessages([]);
    }

    const deleteAllCreatedGroups = () => {

        const allDocsCreatedByCurrentUser = query(collection(db,'chatRooms'), where("createdBy", "==", currentUser.uid));

        onSnapshot(allDocsCreatedByCurrentUser, (snap) => {
            const { docs } = snap;
            docs.forEach(group => {
               deleteDoc(doc(db, 'chatRooms', group.id)).then(x => console.log("all deleted"));
            });
        })
    }

    const fetchGroups = () => {
        if (currentUser?.uid) {
            const querySnapshot = query(collection(db, 'chatRooms'), where('members', 'array-contains', currentUser.uid));

            onSnapshot(querySnapshot, (snap) => {
                const { docs } = snap;

                const groups = docs.map(group => ({id: group.id, ...group.data()}))

                setGroups(groups);
            });

        }
    }

    const fetchGroupMessages = () => {

        const querySnapshot = query(doc(db, 'messages', selectedRoomId));
        onSnapshot(querySnapshot, (snap) => {
            if (snap.data() != undefined)
                setMessages(snap.data().messages);
        });
    }


    React.useEffect(() => {

        if (selectedRoomId)
            fetchGroupMessages();

    },[selectedRoomId])

    React.useEffect(() => {

        fetchGroups();

    }, [isLoggedIn])

    const value = {
        groups,
        messages,
        cleanupMessages,
        deleteAllCreatedGroups
    };

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}


export default ChatContextProvider;