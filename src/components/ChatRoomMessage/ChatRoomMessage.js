import React, { useContext, useRef, useState } from 'react';
import './ChatRoomMessage.scss';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';
import { Download } from 'react-feather';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import useChat from '../../hooks/useChat';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const getBytes = (bytes) => {
    const sufixes = ['B', 'kB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    let suffixIndx = i < 0 ? 0 : i;
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[suffixIndx]}`;
}

const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
};

const ChatRoomMessage = ({ message, breaking }) => {

    //const [isOurs, setIsOurs] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    //ref is used not to make any additional renders while comparing
    //ordinary let variable could be used instead
    const isOurs = useRef(false);

    const { messages } = useChat();

    const messageRef = useRef();

    const {
        sentByName,
        messageText,
        replyTo,
        sentAt,
        sentBy,
        fileName,
        size,
        isRead,
        id
    } = message || {};

    if (sentBy === currentUser.uid) isOurs.current = true;

    else isOurs.current = false;

    const { selectedRoomId } = useContext(AuthContext);

    const [isVisible, setIsVisible] = useState(false);

    const observerCallback = (entries) => {
        console.log(isVisible);
        const [ entry ] = entries;
        setIsVisible(entry.isIntersecting);
    }

    //const { fileUploadStatus } = useChat();

    const storage = getStorage();

    const storageRef = ref(storage, `files/${selectedRoomId}/${fileName}`);

    const handleDownload = (event) => {
         getDownloadURL(storageRef)
        .then((url) => window.open(url,'_blank'));
    }

    const markAsRead = async () => {
        const docRef = doc(db, 'messages' + '/' + selectedRoomId);
        const copyMessages = messages.map(item => {
            if (item.id === id) item.isRead = true;
            return item;
        });
        await updateDoc(docRef, {
            messages: copyMessages
        });
    }

    React.useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, options);

        if (messageRef.current) observer.observe(messageRef.current);

        return () => {
            if (messageRef.current) observer.unobserve(messageRef.current);
        }

    }, [messageRef, options])

    React.useEffect(() => {

        if (isVisible && !isRead && sentBy !== currentUser.uid) 
            markAsRead();
    },[isVisible])

    return <>
        <div ref={messageRef} className={isOurs.current === true ? 'chat-room_message ours': 'chat-room_message users'}>
            <div className={`${isOurs.current === true ? 'ours' : 'users' }`}>
                { breaking === true ? <div className='message__new-by'>{`Sent by ${sentBy === currentUser.uid ? 'You' : sentByName}`}</div> : null }
            {
                message?.type === 'text' ? 
                <div className={`message__new new ${isOurs.current === true ? 'message__new-ours' : ''}` }>
                    {messageText}
                    <div className='timestamp'>{dayjs(sentAt.toDate()).format("HH:MM")}</div>
                    <div className='checkmark-sent-delivered'>&#x2713;</div>
                    { isRead && <div className='checkmark-read'>&#x2713;</div> }
                </div> : 
                <div className={`message__new new ${isOurs.current === true ? 'message__new-ours' : ''}` }>
                    <div className='message__new-file'>
                        <div className='message__new-file_download'>
                            <Download className='' size={22} onClick={handleDownload} />
                        </div>
                        <div className='message__new-file_description'>
                            <div className='message__new-file_description-name'>
                                {fileName}
                            </div>
                            <span className='message__new-file_description-size'>
                                {getBytes(size)}
                            </span>
                        </div>
                    </div>
                    <div className='timestamp'>{dayjs(sentAt.toDate()).format("HH:MM")}</div>
                    <div className='checkmark-sent-delivered'>&#x2713;</div>
                    <div className='checkmark-read'>&#x2713;</div>
                </div> 
            }
            </div>
        </div>
    </>
}


export default ChatRoomMessage;