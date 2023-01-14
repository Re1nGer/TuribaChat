import React from 'react';
import "./ChatRoom.scss";

const ChatRoomInfo = ({ isOpen, group, setIsOpen }) => {

    if (!isOpen) return null;

    return (
        <>
            <div className='room__info-overlay' onClick={() => setIsOpen(false)}></div>
            <div className='room__info' onClick={(e) => e.stopPropagation()}>
                <div className='room__info-members'>
                    <div className='room__info-members_label'>Members:</div>
                    <div className='room__info-members_text'>{group?.members?.length}</div>
                </div>
                <div className='room__info-createdby'>
                    <div className='room__info-createdby_label'>Created By:</div>
                    <div className='room__info-createdby_text'>{group?.createdBy}</div>
                </div>
            </div>
        </>
     );
}

export default ChatRoomInfo;