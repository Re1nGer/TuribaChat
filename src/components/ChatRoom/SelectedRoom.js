import React, { useContext, useRef } from 'react';
import ChatRoomMessage from '../ChatRoomMessage/ChatRoomMessage';
import MessageInput from '../MessageInput/MessageInput';
import useSignalR from '../../hooks/useSignalR';
import "./ChatRoom.scss";
import { AuthContext } from '../../context/AuthContext';


// function returns ids of messages that appear last before they superseded by another user
const selectBreakingMessage = (messages) => {
    let result = {};
    if (!messages) return result;
    for(let i = 0; i < messages.length - 1; i++) {
        if (messages[i].sentBy !== messages[i + 1].sentBy) {
            //resultArr.push(messages[i].id);
            //result[messages[i].id] = 
            //result.add(messages[i].id);
            result[messages[i].id] = messages[i].sentBy;
        } else if (i + 1 === messages.length - 1) result[messages[i + 1].id] = messages[i].sentBy;
    }
    return result;
}

const SelectedRoom = ({ messages }) => {

    const ref = useRef();

    const breakingMessageIds = useRef({});

    const { connection } = useSignalR();  

    const { currentUser } = useContext(AuthContext);

    React.useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    },[messages])

    if (messages.length === 0) {
        return <>
            <div className='room__messages'>
                <h2>No Messages Yet!!!</h2>
            </div>
            <MessageInput />
        </>
    }
    // we know exactly we've got the messages
    //lastOurMessage.current = messages.findLast(item => item.sentBy === currentUser.uid);

    //lastTheirMessage.current = messages.findLast(item => item.sentBy !== currentUser.uid);

    breakingMessageIds.current = selectBreakingMessage(messages);
    console.log(selectBreakingMessage(messages));

    return <>
        <div className='room__messages'>
            {messages.map((message, id) => {
               return <ChatRoomMessage key={id}
/*                     lastOurMessage={breakingMessageIds.current[message.id] === currentUser.uid}
                    lastTheirMessage={breakingMessageIds.current[message.id] !== currentUser.uid} */
                    breaking={message.id in breakingMessageIds.current}
                    message={message}
                />
            })}
            <div ref={ref}></div>
        </div>
        <MessageInput connection={connection} />
    </>
}


export default SelectedRoom;