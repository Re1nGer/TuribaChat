import React from 'react';
import { Search as SearchIcon, Menu as MenuIcon } from 'react-feather';
import { AuthContext } from '../../context/AuthContext';
import DefaultRoom from './DefaultRoom';
import { useParams } from 'react-router-dom';
import './ChatRoom.scss';
import SelectedRoom from './SelectedRoom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import DefaultRoomImage from './images/avatardefault.png';

const ChatRoom = () => {

    const { selectedRoomId, setSelectedRoomId } = React.useContext(AuthContext);

    const [groupMetadata, setGroupMetadata] = React.useState();

    const { groupId } = useParams();

    const fetchGroupMetadata = async () => {
        try {
            const chatGroupQuery = doc(db, 'chatRooms', groupId);

            const roomSnap = await getDoc(chatGroupQuery);


            setGroupMetadata(roomSnap.data());

        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        if (groupId)  {
            setSelectedRoomId(groupId);
            //fetchGroupMetadata();
        }
        
    },[groupId])

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
            { selectedRoomId === '' ? <DefaultRoom /> : <SelectedRoom /> }
        </div>
    </>
}


export default ChatRoom;