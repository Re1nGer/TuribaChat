import React from 'react';

export const MessageReply = ({ replyTo }) => {

    const { sentByName, messageText } = replyTo || {};

    return <div className='message__replyTo'>
        <div className='message__replyTo-user'>
            {sentByName}
        </div>
        <div className='message__replyTo-content'>
            {messageText}
        </div>
    </div>;
};
