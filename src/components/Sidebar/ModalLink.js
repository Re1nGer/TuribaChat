import React from 'react';
import { Copy } from 'react-feather';

export const ModalLink = ({ groupLink }) => {

    const handleCopyLink = () => {
        navigator.clipboard.writeText(groupLink);
        alert('Link has been copied !');
    }

    return <div className='modal__link'>
        <input className='modal__link-input' type='text' disabled value={groupLink} />
        <div className='modal__link-icon_container'>
            <Copy className='modal__icon' onClick={handleCopyLink} />
        </div>
    </div>;
};
