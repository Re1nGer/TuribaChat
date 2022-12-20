import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';


const ChatRoomSidebar = ({
    id,
    groupImgSrc,
    groupName,
    groupLastMessage,
    groupLastMessageTime,
 }) => {

    const [isRoomSelected, setIsRoomSelected] = useState(false);

    const { selectedRoomId, setSelectedRoomId } = useContext(AuthContext);

    const handleRoomSelect = (id) => {
        setSelectedRoomId(id);
    }

    React.useEffect(() => {
        if (selectedRoomId === id)
            setIsRoomSelected(true);
        else setIsRoomSelected(false);

    },[selectedRoomId])

    return <>
        <div className={isRoomSelected ? 'chat-room-sidebar chat-room-sidebar--selected': 'chat-room-sidebar'} onClick={() => handleRoomSelect(id)}>
            <div className={'chat-room-sidebar__inner'}>
                <div className='chat-room-sidebar__picture'><img src={groupImgSrc} alt='group picture' /></div>
                <div className='chat-room-sidebar__group'>
                    <div className='chat-room-sidebar__group-name'>{groupName}</div>
                    <div className='chat-room-sidebar__group-last-message'>{groupLastMessage}</div>
                </div>
            </div>
            <div className='chat-room-sidebar__last-message-time'>{groupLastMessageTime}</div>
        </div> 
    </>
}


export default ChatRoomSidebar;