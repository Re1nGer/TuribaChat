import React, { useRef } from 'react';
import ChatRoomMessage from '../ChatRoomMessage/ChatRoomMessage';
import MessageInput from '../MessageInput/MessageInput';
import "./ChatRoom.scss";

const SelectedRoom = ({ messages }) => {

    const ref = useRef();

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

    return <>
        <div className='room__messages'>
            {messages.map((message, id) => <ChatRoomMessage key={id} message={message} />)}
            <div ref={ref}></div>
        </div>
        <MessageInput />
    </>
}


export default SelectedRoom;