import React from 'react';
import './ChatRoomMessage.scss';


const RoomMessage = ({ messageText }) => {

    return (
        <div className='message__content'>
            <div className='message__content-header'>{messageText?.sentByName}</div>
            <p className='message__content-body'>
                {messageText.messageText}
            </p>
        </div>
        )
    

}


export default RoomMessage;
