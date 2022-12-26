import React, { useContext, useState } from 'react';
import { updateDoc, doc, arrayUnion, arrayRemove, getDoc, onSnapshot, limitToLast } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { db } from '../../firebase';
import { AuthContext } from '../context/AuthContext';
import {v4 as uuidv4} from 'uuid';


const useChat = () => {

    const { selectedRoomId, currentUser, selectedMessage } = useContext(AuthContext);

    const [fileUploadStatus, setFileUploadStatus] = useState('');

    const [messages, setMessages] = useState([]);

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

        //const docRef = dbRef(db, 'messages', selectedRoomId);

        //const pushMessage = push(docRef);

        //await set(pushMessage, message);

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

        const fileSize = Math.round((file.size / 1024));

        console.log(fileSize);

        //file size too huge break...
        if (fileSize > 4096) return;

        const metadata = { contentType: file.type };

        const storage = getStorage();

        const storageRef = ref(storage, `files/${selectedRoomId}/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        const { recentMessage } = (await getDoc(doc(db, 'chatRooms', selectedRoomId))).data() || {};

        const message = {
            id: uuidv4(),
            type: 'file',
            messageText: '',
            isRead: false,
            fileName: file.name,
            sentByName: currentUser.displayName,
            sentAt: new Date(),
            sentBy: currentUser.uid,
            contentType: file.type,
            replyTo: selectedMessage !== undefined ? { messageText, sentByName } : null,
            size: file.size / (1024 ** 2)
        };

        await updateDoc(doc(db, 'messages', selectedRoomId), {
            messages: arrayUnion(message),
        });

        await updateDoc(doc(db, 'chatRooms', selectedRoomId), {
            recentMessage: { message: file.name }
        });

        uploadTask.on('state_changed', 

            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                setFileUploadStatus(snapshot.state);
                console.log(snapshot.state);
            }, 
            async (error) => {
                // Handle unsuccessful uploads
                console.log(error);
                await updateDoc(doc(db, 'messages', selectedRoomId), { messages: arrayRemove(message) });

                await updateDoc(doc(db, 'chatRooms', selectedRoomId), { recentMessage: { message: recentMessage.message } });
            });
        }
    
        React.useEffect(() => {

        let subcribe = null;

        if (selectedRoomId) {
            subcribe = onSnapshot(doc(db, "messages", selectedRoomId), (document) => {
                setMessages(document.data().messages);
            }, limitToLast(25));
        }

        return () => subcribe

        },[selectedRoomId]);

    return { sendMessageAndUpdateLastGroupMessage, uploadFile, fileUploadStatus, messages };
}


export default useChat;