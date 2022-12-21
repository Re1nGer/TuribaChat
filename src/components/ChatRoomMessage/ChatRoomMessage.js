import React, { useContext } from 'react';
import './ChatRoomMessage.scss';
import { AuthContext } from '../../context/AuthContext';
import RoomMessage from './RoomMessage';
import RoomFile from './RoomFile';
import dayjs from 'dayjs';



const ChatRoomMessage = ({ message }) => {

    const [isOurs, setIsOurs] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    console.log(message);

    React.useEffect(() => {
        if (message.sentBy === currentUser.uid)
            setIsOurs(true)
        else setIsOurs(false);
    },[message.sentBy])

    return <>
        <div className={isOurs ? 'chat-room_message ours': 'chat-room_message users'}>
            <div className={`${isOurs ? 'chat-room_message__inner chat-room_message__inner--ours': 'chat-room_message__inner'}`}>
                <div className='chat-room_message__content'>
                    { message.type === 'text' ? <RoomMessage messageText={message} /> : <RoomFile size={message.size} fileName={message.fileName} />  }
                </div>
                <div className='chat-room_message__datetime'>
                    {dayjs(message.sentAt?.toDate()).format('HH:MM')}
                </div>
            </div>
        </div>
    </>
}


export default ChatRoomMessage;