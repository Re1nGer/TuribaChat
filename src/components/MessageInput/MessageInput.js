import React, { useContext, useRef, forwardRef } from 'react';
import { Smile, Paperclip, Send, X } from 'react-feather';
import './MessageInput.scss';
import useChat from '../../hooks/useChat';
import { AuthContext } from '../../context/AuthContext';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';


const MessageInput = ({ connection }, ref) => {

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

    const [inputText, setInputText] = React.useState('');

    const inputRef = useRef();

    const onInputChange = async (e) => {
        if (connection) await connection.send('StartTyping', currentUser?.uid, selectedRoomId);
    }

    const sendForm = async () => {
        if (inputRef.current.value.trim() === '') return
        //const messageText = inputRef.current.value;
        //inputRef.current.value = '';
        const messageText = inputRef.current.value; //inputText;
        //inputRef.current.innerHTML = '';
        //setSelectedMessage();
        inputRef.current.value = "";
        try {
            await sendMessageAndUpdateLastGroupMessage(messageText);
            inputRef.current.value = "";
            //setInputText('')
            ref.current?.scrollIntoView({behavior: 'smooth'});
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

    const onEnterPress = async (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            await sendForm()
        }
    }

    React.useEffect(() => {
        if (emoji) inputRef.current.value+=emoji.emoji;
       
        setIsInputTextEmpty(inputRef.current.value === '' ? true : false );
    },[emoji])

    if (inputRef.current) inputRef.current.focus()

    useAutosizeTextArea(inputRef.current, inputText);

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
                        ref={inputRef}
                        placeholder={'Type a message'}
                        onChange={onInputChange}
                        className='message-input__input'
                        name={'message'}
                        wrap={'soft'}
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


export default forwardRef(MessageInput);