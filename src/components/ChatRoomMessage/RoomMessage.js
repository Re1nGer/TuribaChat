import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './ChatRoomMessage.scss';

const RoomMessage = ({ message }) => {

    const { currentUser } = useContext(AuthContext);

    const {
        messageText,
        sentAt,
        sentBy
    } = message || {};

    return (
        <div className={`message__new new ${currentUser?.uid === sentBy ? 'message__new-ours' : ''}` }>
            {messageText}
            <div className='timestamp'>{dayjs(sentAt.toDate()).format("HH:MM")}</div>
            <div className='checkmark-sent-delivered'>&#x2713;</div>
            <div className='checkmark-read'>&#x2713;</div>
        </div>
    )
}

export default RoomMessage;