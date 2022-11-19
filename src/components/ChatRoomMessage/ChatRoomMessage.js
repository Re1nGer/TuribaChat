import React, { useContext } from 'react';
import './ChatRoomMessage.scss';
import { AuthContext } from '../../context/AuthContext';
import RoomMessage from './RoomMessage';
import RoomFile from './RoomFile';



const ChatRoomMessage = ({ message }) => {

    const [isOurs, setIsOurs] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    React.useEffect(() => {
        if (message.sentBy === currentUser.uid)
            setIsOurs(true)
        else setIsOurs(false);
    },[message.sentBy])

    return <>
        <div className={isOurs ? 'chat-room-message ours': 'chat-room-message users'}>
            <div className={`${isOurs ? 'chat-room-message__inner--ours': 'chat-room-message__inner'}`}>
                <div className='chat-room-message__content'>
                    { message.type === 'text' ? <RoomMessage messageText={message} /> : <RoomFile fileName={message.fileName} />  }
                </div>
                <select className='select'>
                    <option>Reply</option>
                </select>
            </div>
        </div>
    </>
}


export default ChatRoomMessage;