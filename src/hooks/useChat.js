import { useContext } from 'react';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { uploadBytes, getStorage, ref } from 'firebase/storage';
import { db } from '../../firebase';
import { AuthContext } from '../context/AuthContext';
import {v4 as uuidv4} from 'uuid';
import { getMessaging, onMessage } from "firebase/messaging";


const useChat = () => {

    const { selectedRoomId, currentUser, selectedMessage } = useContext(AuthContext);

    const sendMessageAndUpdateLastGroupMessage = async (inputMessage) => {

        const { messageText, sentByName } = selectedMessage || {};

        const message = {
            messageText: inputMessage,
            sentAt: new Date(),
            isRead: false,
            sentBy: currentUser.uid,
            sentByName: currentUser.displayName,
            type: 'text',
            replyTo: selectedMessage !== undefined ? { messageText, sentByName } : null,
            id: uuidv4()
        };

        await updateDoc(doc(db, 'messages', selectedRoomId), {
            messages: arrayUnion(message) 
        });

        await updateDoc(doc(db, 'chatRooms', selectedRoomId), {
            recentMessage: {
                message: inputMessage
            }
        });
    }

    const uploadFile = async (event) => {

        const file = event.target.files[0];

        const metadata = { contentType: file.type };

        const storage = getStorage();

        const storageRef = ref(storage, `files/${selectedRoomId}/${file.name}`);

        uploadBytes(storageRef, file, metadata);

        const message = {
            type: 'file',
            messageText: '',
            isRead: false,
            fileName: file.name,
            sentAt: new Date(),
            sentBy: currentUser.uid,
            contentType: file.type,
            replyTo: selectedMessage !== undefined ? { messageText, sentByName } : null,
            size: file.size / (1024 ** 2)
        };

        await updateDoc(doc(db, 'messages', selectedRoomId), {
            messages: arrayUnion(message)
        });

        await updateDoc(doc(db, 'chatRooms', selectedRoomId), {
            recentMessage: { message: file.name }
        });
    }

    return { sendMessageAndUpdateLastGroupMessage, uploadFile }
}


export default useChat;