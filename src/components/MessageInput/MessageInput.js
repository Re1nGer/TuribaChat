import React, { useContext, useRef } from 'react';
import { Smile, Paperclip, Send, X } from 'react-feather';
import './MessageInput.scss';
import useChat from '../../hooks/useChat';
import { AuthContext } from '../../context/AuthContext';
import { Emoji } from 'emoji-picker-react';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';


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

    const [inputText, setInputText] = React.useState('');

    const inputRef = useRef();

    const onInputChange = async (e) => {
        setIsInputTextEmpty(e.target.value === '' ? true : false );
        setInputText(e.target.value);
        //setIsInputTextEmpty(inputRef.current.innerHTML === '' ? true : false );
        //setInputText([inputRef.current.innerHTML]);
        //console.log(inputRef.current.innerHTML);
        if (connection) await connection.send('StartTyping', currentUser?.uid);
    }

    const sendForm = async () => {
        if (inputRef.current.value === '') return
        //const messageText = inputRef.current.value;
        //inputRef.current.value = '';
        const messageText = inputText; //inputText;
        //inputRef.current.innerHTML = '';
        setInputText([])
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

    const onEnterPress = async (e) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            await sendForm()
        }
    }

    React.useEffect(() => {
        if (emoji) {
            setInputText(prevState => [...prevState, emoji.emoji]);
            //inputRef.current.innerHTML+=`<img src=${emoji.getImageUrl()}  />`
        }
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
                        value={inputText}
                    />
{/*                      <div contentEditable={true}
                        //onKeyDown={onEnterPress}
                        ref={inputRef}
                        onInput={onInputChange}
                        //onChange={onInputChange}
                        className='message-input__input'
                    >{inputText.map(item => item?.unified ? <Emoji size={16} unified={item.unified} /> : item)}
                    </div> */}
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