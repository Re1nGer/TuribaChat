import React, { useContext, useRef } from 'react';
import { Smile, Paperclip, Send, X, Copy } from 'react-feather';
import EmojiPicker from 'emoji-picker-react';
import './MessageInput.scss';
import useChat from '../../hooks/useChat';
import useDebounce from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';


const MessageInput = () => {

    const [isEmojiTabOpen, setIsEmojiTabOpen] = React.useState(false);

    const { sendMessageAndUpdateLastGroupMessage, uploadFile } = useChat();

    const { selectedMessage, setSelectedMessage } = useContext(AuthContext);

    console.log(selectedMessage);

    const [isInputTextEmpty, setIsInputTextEmpty] = React.useState(true);

    const inputRef = useRef();

    const onSubmitMessage = async (event) => {

        event.preventDefault();

        await sendForm();
    }

    const onInputChange = (e) => {
        setIsInputTextEmpty(e.target.value === '' ? true : false );
    }

    const sendForm = async () => {
        if (inputRef.current.value === '') return

        const messageText = inputRef.current.value;

        inputRef.current.value = '';

        setSelectedMessage();
        
        await sendMessageAndUpdateLastGroupMessage(messageText);
    }

    const handleClose = () => {
        setSelectedMessage();
    }

    const debouncedOnInputChange = useDebounce(onInputChange, 200);

    const onEnterPress = async (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            await sendForm()
        }
    }

    return <>
{/*         { isEmojiTabOpen &&
            <EmojiPicker previewConfig={{showPreview:false}} height={300} onEmojiClick={() => {}} />
        } */}
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
                        <Smile onClick={() => setIsEmojiTabOpen(prevState => !prevState)} />
                    </div>
                    <FileInput onChange={(event) => uploadFile(event)} />
                </div>
                <div className='message-input__input-wrapper'>
                    <textarea onKeyDown={onEnterPress} cols="5" rows={1} wrap="soft" ref={inputRef} placeholder={'Type a message'} onChange={debouncedOnInputChange} className='message-input__input' type={'text'} name={'message'} />
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