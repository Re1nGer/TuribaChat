import React from 'react';
import { Search as SearchIcon, Menu as MenuIcon } from 'react-feather';
import { AuthContext } from '../../context/AuthContext';
import DefaultRoom from './DefaultRoom';
import { useParams } from 'react-router-dom';
import './ChatRoom.scss';
import SelectedRoom from './SelectedRoom';
import { onSnapshot, doc, getDoc, limitToLast } from 'firebase/firestore';
import { db } from '../../../firebase';
import DefaultRoomImage from './images/avatardefault.png';

const ChatRoom = () => {

    const { selectedRoomId, setSelectedRoomId } = React.useContext(AuthContext);

    const [groupMetadata, setGroupMetadata] = React.useState();

    const [messages, setMessages] = React.useState([]);

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
        let subcribe = null;
        fetchGroupMetadata();

        if (selectedRoomId) {
            subcribe = onSnapshot(doc(db, "messages", selectedRoomId), (document) => {
                setMessages(document.data().messages);
            }, limitToLast(25));
        }

        return () => subcribe
        
    },[id, selectedRoomId])

    return <>
        <div className='room'>
            <header className='room__header'>
                <div className='room__metadata'>
                    <div className='room__metadata-picture'>
                        <img src={DefaultRoomImage} alt='room picture' />
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