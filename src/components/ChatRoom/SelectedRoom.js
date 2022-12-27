import React, { useContext, useRef, useState } from 'react';
import ChatRoomMessage from '../ChatRoomMessage/ChatRoomMessage';
import MessageInput from '../MessageInput/MessageInput';
import useSignalR from '../../hooks/useSignalR';
import "./ChatRoom.scss";
import { AuthContext } from '../../context/AuthContext';
import { onSnapshot, limitToLast, doc} from 'firebase/firestore';
import { db } from '../../../firebase';
import useDebounce from '../../hooks/useDebounce';
import { useParams } from 'react-router-dom';

// function returns ids of messages that appear last before they superseded by another user
const selectBreakingMessage = (messages) => {
    let result = {};
    if (!messages) return result;
    for(let i = 0; i < messages.length - 1; i++) {
        if (messages[i].sentBy !== messages[i + 1].sentBy) {
            result[messages[i].id] = messages[i].sentBy;
        } else if (i + 1 === messages.length - 1) result[messages[i + 1].id] = messages[i].sentBy;
    }
    return result;
}

const SelectedRoom = () => {

    const ref = useRef();

    const breakingMessageIds = useRef({});

    const { groupId } = useParams();

    const { currentUser, selectedRoomId } = useContext(AuthContext);

    const { connection, isUserTyping, setIsUserTyping } = useSignalR();  

    const [messages, setMessages] = useState([]);

    //const [isTyping, setIsTyping] = useState(false);

    const handleTypingStatus = () => {
        setIsUserTyping(true);
        setTimeout(() => setIsUserTyping(false), 5000);
    }

    React.useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    },[])

    React.useEffect(() => {

        let subcribe = null;

        if (selectedRoomId) {
            subcribe = onSnapshot(doc(db, "messages", selectedRoomId), (document) => {
                setMessages(document.data().messages);
            }, limitToLast(25));
        }

    return () => {
        subcribe();
    } 

    },[selectedRoomId]);

    const debouncedTyping = useDebounce(handleTypingStatus, 300);

    React.useEffect(() => {

        if (connection && connection.state !== "Disconnected") {
            connection.invoke("AddToGroup", selectedRoomId);
            connection.on("ReceiveTypingStatus", (userId, groupId) => {
                if (userId !== currentUser.uid && groupId === groupId)
                    debouncedTyping();
            });
        } 
    

        return () =>  { 
            if (connection?.state !== "Disconnecting")
                connection?.send("RemoveFromGroup", groupId); 
        }
    },[selectedRoomId, connection])

    if (messages.length === 0) {
        return <>
            <div className='room__messages'>
                <h2>No Messages Yet!!!</h2>
            </div>
            <MessageInput />
        </>
    }
    // we know exactly we've got the messages

    breakingMessageIds.current = selectBreakingMessage(messages);

    return <>
        <div className='room__messages'>
            {messages.map((message, id) => {
               return <ChatRoomMessage key={id}
                    messages={messages}
                    breaking={message.id in breakingMessageIds.current}
                    message={message}
                />
            })}
            <div ref={ref}></div>
            <div style={{width:'100px'}}>
                <div className={`message__new loading ${!isUserTyping ? 'loading--hide' : '' }`}>
                    { isUserTyping ? <span></span> : null }
                </div>
            </div>
        </div>
        <MessageInput connection={connection} ref={ref} />
    </>
}

export default SelectedRoom;