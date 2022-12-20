import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './ChatRoomMessage.scss';


const RoomMessage = ({ messageText }) => {

    const { selectedMessage, setSelectedMessage } = useContext(AuthContext);

    const handleSelect = (event) => {
        console.log(event);
        if (event.target.value === 'reply')
            setSelectedMessage(messageText);
    }

    return (
        <div className='message__content'>
            <div className='message__content-header'>
                <div>{messageText?.sentByName}</div>
                <select defaultValue={'something else'} className='select' onChange={handleSelect}>
                    <option value={'reply'}>Reply</option>
                    <option defaultChecked value={'something else'}>Something else</option>
                </select>
            </div>
            <p className='message__content-body'>
                {messageText.messageText}
            </p>
        </div>
    )
}


export default RoomMessage;
