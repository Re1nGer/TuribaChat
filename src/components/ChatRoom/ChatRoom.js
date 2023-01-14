import React from 'react';
import { Search as SearchIcon } from 'react-feather';
import { AuthContext } from '../../context/AuthContext';
import DefaultRoom from './DefaultRoom';
import { useNavigate, useParams } from 'react-router-dom';
import './ChatRoom.scss';
import SelectedRoom from './SelectedRoom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import DefaultRoomImage from './images/avatardefault.png';
import ChatRoomInfo from './ChatRoomInfo';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { ArrowLeft } from 'react-feather';

const ChatRoom = () => {

    const { selectedRoomId, setSelectedRoomId } = React.useContext(AuthContext);

    const [groupMetadata, setGroupMetadata] = React.useState();

    const [isChatRoomInfoOpen, setIsChatRoomInfoOpen] = React.useState(false);

    const { groupId } = useParams();

    const { width } = useWindowDimensions();

    const navigate = useNavigate();

    const fetchGroupMetadata = async () => {
        try {
            const chatGroupQuery = doc(db, 'chatRooms', groupId);

            const roomSnap = await getDoc(chatGroupQuery);

            setGroupMetadata(roomSnap.data());

        } catch (error) {
            console.log(error);
        }
    }

    const isMobile = width < 500;

    const handleChatRoomInfo = () => {
        setIsChatRoomInfoOpen(true);
    }

    const handleBackForMobile = () => {
        setSelectedRoomId('');
        navigate('/dashboard');
    }

    React.useEffect(() => {
        if (groupId)  {
            setSelectedRoomId(groupId);
            fetchGroupMetadata();
        }
        
    },[groupId])

    //TODO: add swipes for mobile version

    if (isMobile && !groupId) return null;

    return <>
        <div className='room'>
            <ChatRoomInfo
                isOpen={isChatRoomInfoOpen}
                setIsOpen={setIsChatRoomInfoOpen}
                group={groupMetadata}
            />
            <header className='room__header'>
                <div className='room__metadata'>
                    <div className='room__metadata-picture'>
                        <img src={DefaultRoomImage} alt='room' />
                    </div>
                    <div className='room__metadata-name' onClick={handleChatRoomInfo}>
                        { groupMetadata?.name }
                    </div>
                </div>
                <div className='room__options'>
                    <SearchIcon />
                    { isMobile && <ArrowLeft onClick={handleBackForMobile} /> }
                </div>
            </header>
            { selectedRoomId === '' ? <DefaultRoom /> : <SelectedRoom /> }
        </div>
    </>
}


export default ChatRoom;