import React, { useContext, useRef, forwardRef } from 'react';
import { Smile, Paperclip, Send, X } from 'react-feather';
import './MessageInput.scss';
import useChat from '../../hooks/useChat';
import { AuthContext } from '../../context/AuthContext';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import ContentEditable from 'react-contenteditable';


const MessageInput = ({ connection }, ref) => {

    const { sendMessageAndUpdateLastGroupMessage, uploadFile } = useChat();

    const { 
        selectedMessage,
        setSelectedMessage,
        setIsEmojiTabOpen,
        isEmojiTabOpen,
        currentUser,
        selectedRoomId,
        debouncedSetText,
        text,
     } = useContext(AuthContext);

    const [isInputTextEmpty, setIsInputTextEmpty] = React.useState(true);

    const inputRefText = useRef();

    const onInputChange = async (e) => {
        debouncedSetText(e.target.value);
        if (connection) await connection.send('StartTyping', currentUser?.uid, selectedRoomId);
        //inputRefText.current.focus();
    }

    const sendForm = async () => {
        if (inputRefText.current.trim() === '') return
        debouncedSetText('');
        try {
            await sendMessageAndUpdateLastGroupMessage(inputRefText.current.innerHTML);
            //need to set it to an empty string to resize textarea
            //inputRef.current.html = "";
            ref.current?.scrollIntoView({behavior: 'smooth'});
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
            e.preventDefault();
            await sendForm()
        }
    }

    if (inputRefText.current) inputRefText.current.focus()

    //console.log(text);

    //useAutosizeTextArea(inputRefText.current, text);

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
                     <ContentEditable 
                        innerRef={inputRefText}
                        className='message-input__input'
                        onKeyDown={onEnterPress}
                        onChange={onInputChange}
                        placeholder={'Type a message'}
                        disabled={false}
                        html={text}
                     />
                </div>
                <div className='message-input__send'>
                    <button type='submit' disabled={false} className='message-input__send-button'>
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