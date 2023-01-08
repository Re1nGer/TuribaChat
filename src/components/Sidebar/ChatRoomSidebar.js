import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.scss';
import parse from 'html-react-parser';


const ChatRoomSidebar = ({
    id,
    groupImgSrc,
    groupName,
    groupLastMessage,
    groupLastMessageTime,
 }) => {

    const [isRoomSelected, setIsRoomSelected] = useState(false);

    const { selectedRoomId, setSelectedRoomId } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleRoomSelect = (id) => {
        setSelectedRoomId(id);
        navigate('/dashboard/' + id);
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
                    <div className='chat-room-sidebar__group-last_message'>{parse(groupLastMessage)}</div>
                </div>
            </div>
            <div className='chat-room-sidebar__last-message-time'>{groupLastMessageTime}</div>
        </div> 
    </>
}


export default ChatRoomSidebar;