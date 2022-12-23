import React from 'react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const MessageActions = ({messageText}) => {

    const { setSelectedMessage } = useContext(AuthContext);

    const [selectValue, setSelectValue] = useState('');

    const handleSelect = (event) => {
        if (event.target.value === 'reply') {
            setSelectedMessage(messageText);
            setSelectValue(null);
        }
        setSelectValue(event.target.value);
    }

    return (
        <select value={selectValue} className='select' onChange={handleSelect}>
            <option defaultChecked disabled value={null}></option>
            <option value={'reply'}>Reply</option>
            <option value={'something else'}>Something else</option>
        </select>
    );
};

export default MessageActions;
