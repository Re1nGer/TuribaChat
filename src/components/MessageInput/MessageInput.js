import React, { useContext, useRef } from 'react';
import { Smile, Paperclip, Send, X } from 'react-feather';
import './MessageInput.scss';
import useChat from '../../hooks/useChat';
import useDebounce from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';


const MessageInput = ({ connection }) => {

    const { sendMessageAndUpdateLastGroupMessage, uploadFile } = useChat();

    const { 
        selectedMessage,
        setSelectedMessage,
        setIsEmojiTabOpen,
        isEmojiTabOpen,
        emoji,
        currentUser,
        selectedRoomId
     } = useContext(AuthContext);

    const [isInputTextEmpty, setIsInputTextEmpty] = React.useState(true);

    const inputRef = useRef();

    const onInputChange = async (e) => {
        //if (connection) await connection.send('StartTyping', currentUser?.uid);
        setIsInputTextEmpty(e.target.value === '' ? true : false );
    }

    const sendForm = async () => {
        if (inputRef.current.value === '') return
        const messageText = inputRef.current.value;
        inputRef.current.value = '';
        setSelectedMessage();
        try {
            await sendMessageAndUpdateLastGroupMessage(messageText);
            //if (connection) await connection.send('SendNotification', selectedRoomId);
        } catch (error) {}
    }

    const onSubmitMessage = async (event) => {
        event.preventDefault();
        await sendForm();
    }

    const handleClose = () => {
        setSelectedMessage();
    }

    const debouncedOnInputChange = useDebounce(onInputChange, 300);

    const onEnterPress = async (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            await sendForm()
        }
    }

    React.useEffect(() => {
        if (inputRef.current)
            inputRef.current.value+=emoji;
        console.log(inputRef.current);
    },[emoji])

    return <>
        <form method='post' onSubmit={onSubmitMessage}>

            { selectedMessage !== undefined ? 
                <>
                    <div className={'scale-up-ver-bottom message__reply message__reply--open'} >
                        <div className='message__reply-content'>
                            {selectedMessage?.messageText}
                        </div>
                        <div className='message__reply-close' onClick={handleClose}>
                            <X />
                        </div>
                    </div>
                </> : null
             }

            <div className='message-input'>
                <div className='message-input__options'>
                    <div className='message-input__emoji'>
                        <Smile className={`message-input__emoji ${isEmojiTabOpen ? 'message-input__emoji--active': ''}`} onClick={() => setIsEmojiTabOpen(prevState => !prevState)} />
                    </div>
                    <FileInput onChange={(event) => uploadFile(event)} />
                </div>
                <div className='message-input__input-wrapper'>
                    <textarea
                        onKeyDown={onEnterPress}
                        cols="5"
                        rows={1}
                        wrap="soft"
                        ref={inputRef}
                        placeholder={'Type a message'}
                        onChange={debouncedOnInputChange}
                        className='message-input__input'
                        type={'text'}
                        name={'message'}
                    />
                </div>
                <div className='message-input__send'>
                    <button type='submit' disabled={isInputTextEmpty} className='message-input__send-button'>
                        <Send />
                    </button>
                </div>
            </div>

        </form>
    </>
}


const FileInput = ({ onChange }) => {

    return <>
            <input id='file' onChange={onChange} type={'file'} hidden />
            <label htmlFor='file' className='message-input__attachments'>
                <Paperclip className='file-input' />
            </label>
        </>

}


export default MessageInput;