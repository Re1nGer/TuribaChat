import React, { useContext } from 'react';
import { Search as SearchIcon, Menu as MenuIcon } from 'react-feather';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, getDoc} from 'firebase/firestore';
import DefaultRoom from './DefaultRoom';
import { useParams } from 'react-router-dom';
import './ChatRoom.scss';
import { ChatContext } from '../../context/ChatContext';
import SelectedRoom from './SelectedRoom';
import BackgroundImage from './images/chat_background.jpg';

const ChatRoom = () => {

    const { selectedRoomId, setSelectedRoomId } = useContext(AuthContext);

    const { messages, cleanupMessages } = useContext(ChatContext);

    const [groupMetadata, setGroupMetadata] = React.useState();

    const { id } = useParams();

    const fetchGroupMetadata = async () => {
        try {
            const chatGroupQuery = doc(db, 'chatRooms', selectedRoomId);

            const roomSnap = await getDoc(chatGroupQuery);

            setGroupMetadata(roomSnap.data());

        } catch (error) {
            console.log(error);
        }
    }


    React.useEffect(() => {

        if (id) setSelectedRoomId(id);

        if (selectedRoomId)
            fetchGroupMetadata();

        return () => cleanupMessages();
            

    },[selectedRoomId])

    return <>
        <div className='room' style={{backgroundImage: `url(${BackgroundImage})`}}>
            <header className='room__header'>
                <div className='room__metadata'>
                    <div className='room__metadata-picture'>
                        <img src='https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png' alt='room picture' />
                    </div>
                    <div className='room__metadata-name'>
                        { groupMetadata?.name }
                    </div>
                </div>
                <div className='room__options'>
                    <SearchIcon />
                    <MenuIcon />
                </div>
            </header>
            { selectedRoomId === '' ? <DefaultRoom /> : <SelectedRoom messages={messages} /> }
        </div>
    </>
}


export default ChatRoom;