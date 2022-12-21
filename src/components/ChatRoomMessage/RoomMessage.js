import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './ChatRoomMessage.scss';


const RoomMessage = ({ messageText }) => {

    const { setSelectedMessage } = useContext(AuthContext);

    const [selectValue, setSelectValue] = useState('');

    const handleSelect = (event) => {
        console.log(event);
        if (event.target.value === 'reply') {
            setSelectedMessage(messageText);
            setSelectValue(null);
        }
        setSelectValue(event.target.value);
    }

    const hasReplyMessage = messageText.replyTo;

    return (
        <div className='message__content'>
            <div className='message__content-header'>
                <div>{messageText?.sentByName}</div>
                <select value={selectValue} className='select' onChange={handleSelect}>
                    <option defaultChecked disabled value={null}></option>
                    <option value={'reply'}>Reply</option>
                    <option value={'something else'}>Something else</option>
                </select>
            </div>
            { hasReplyMessage ? 
                <div className='message__replyTo'>
                    <div className='message__replyTo-user'>
                        {messageText.replyTo.sentByName}
                    </div>
                    <div className='message__replyTo-content'>
                        {messageText.replyTo.messageText}
                    </div>
                    </div>
                : null
            }
            <p className='message__content-body'>
                {messageText.messageText}
            </p>
        </div>
    )
}


export default RoomMessage;
