import React, { useContext, useRef, useState } from 'react';
import ChatRoomMessage from '../ChatRoomMessage/ChatRoomMessage';
import MessageInput from '../MessageInput/MessageInput';
import useSignalR from '../../hooks/useSignalR';
import "./ChatRoom.scss";
import { AuthContext } from '../../context/AuthContext';
import { onSnapshot, limitToLast, doc} from 'firebase/firestore';
import { db } from '../../../firebase';

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

    const { currentUser, selectedRoomId } = useContext(AuthContext);

    const { connection, groupUsers } = useSignalR();  

    const [messages, setMessages] = useState([]);

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
                    breaking={message.id in breakingMessageIds.current}
                    message={message}
                />
            })}
            <div ref={ref}></div>
            <div style={{width:'100px'}}>
                {groupUsers[currentUser.uid]?.isTyping === false && Object.values(groupUsers).some(({isTyping, groupId}) => isTyping === true && groupId === selectedRoomId ) ? 
                    <div className='message__new loading'><span></span></div> : null
                }
            </div>
        </div>
        <MessageInput connection={connection} ref={ref} />
    </>
}

export default SelectedRoom;