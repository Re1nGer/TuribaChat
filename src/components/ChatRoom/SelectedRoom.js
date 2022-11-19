import React, { useRef } from 'react';
import ChatRoomMessage from '../ChatRoomMessage/ChatRoomMessage';
import MessageInput from '../MessageInput/MessageInput';
import "./ChatRoom.scss";

const SelectedRoom = ({ messages }) => {

    const ref = useRef();

    React.useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    },[messages])

    return <>
        <div className='room__messages'>
            {messages.map((message, id) => <ChatRoomMessage key={id} message={message} />)}
            <div ref={ref}></div>
        </div>
        <MessageInput />
    </>
}


export default SelectedRoom;