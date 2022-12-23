import React, { useContext, useRef } from 'react';
import './ChatRoomMessage.scss';
import { AuthContext } from '../../context/AuthContext';
import RoomFile from './RoomFile';
import dayjs from 'dayjs';

const ChatRoomMessage = ({ message, lastOurMessage, lastTheirMessage, breaking }) => {

    //const [isOurs, setIsOurs] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    //ref is used not to make any additional renders while comparing
    //ordinary let variable could be used instead
    const isOurs = useRef(false);

    const {
        sentByName,
        messageText,
        replyTo,
        sentAt,
        sentBy
    } = message || {};

    if (sentBy === currentUser.uid) isOurs.current = true;

    else isOurs.current = false;

    return <>
        <div className={isOurs.current === true ? 'chat-room_message ours': 'chat-room_message users'}>
            <div className={`${isOurs.current === true ? 'ours' : 'users' }`}>
                { breaking === true ? <div className='message__new-by'>{`Sent by ${sentBy === currentUser.uid ? 'You' : sentByName}`}</div> : null }
{/*             { lastOurMessage ? <div className='message__new-by'>{`Sent by you`}</div> : null } */}
{/*             { lastTheirMessage ? <div className='message__new-by'>{`Sent by ${sentByName}`}</div> : null } */}
            {
                message?.type === 'text' ? 
                <div className={`message__new new ${isOurs.current === true ? 'message__new-ours' : ''}` }>
                    {messageText}
                    <div className='timestamp'>{dayjs(sentAt.toDate()).format("HH:MM")}</div>
                    <div className='checkmark-sent-delivered'>&#x2713;</div>
                    <div className='checkmark-read'>&#x2713;</div>
                </div> : <RoomFile size={message?.size} fileName={message?.fileName} />
            }
{/*                 { message?.type === 'text' ? <RoomMessage message={message} /> : <RoomFile size={message?.size} fileName={message?.fileName} />  } */}
            </div>
        </div>
    </>
}


export default ChatRoomMessage;