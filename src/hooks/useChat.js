import { useContext } from 'react';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { uploadBytes, getStorage, ref  } from 'firebase/storage';
import { db } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';

const useChat = () => {

    const { selectedRoomId, currentUser } = useContext(AuthContext);

    const sendMessageAndUpdateLastGroupMessage = async (inputMessage) => {

        const message = {
            messageText: inputMessage,
            sentAt: new Date(),
            isRead: false,
            sentBy: currentUser.uid,
            sentByName: currentUser.displayName,
            type: 'text'
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

        const metadata = {
            contentType: file.type
        };

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
            size: file.size / (1024 ** 2)
        };

        await updateDoc(doc(db, 'messages', selectedRoomId), {
            messages: arrayUnion(message)
        });

        await updateDoc(doc(db, 'chatRooms', selectedRoomId), {
            recentMessage: {
                message: file.name
            }
        });

    }

    return { sendMessageAndUpdateLastGroupMessage, uploadFile }
}


export default useChat;