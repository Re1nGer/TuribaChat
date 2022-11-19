import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import AddGroupModal from './AddGroupModal';
import ChatRoomSidebar from './ChatRoomSidebar';
import { query, where, getDocs, collection, doc, arrayUnion, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import './Sidebar.scss';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import { ChatContext } from '../../context/ChatContext';
import { Menu } from 'react-feather';
import SideNav from '../SideNav/SideNav';
import DropdownMenu from '../DropdownMenu/DropdownMenu';


const Sidebar = () => {

    const [sidenavOpen, setSidenavOpen] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    const { groups } = useContext(ChatContext);

    const { id } = useParams();

    const handleLogout = () => {
        auth.signOut();
    }

    const checkIfUserExists = async () => {
        const q = query(collection(db, 'chatRooms'), where('members', 'array-contains', currentUser.uid));
        const {docs} = await getDocs(q);
        if (docs.length === 0) {
            await updateDoc(doc(db, 'chatRooms', id), {
                members: arrayUnion(currentUser.uid)
            });
        }
    }

    const addMemberIfNotPresentAndFetchGroups = async () => {
        if (currentUser.uid) await checkIfUserExists();
    }

    React.useEffect(() => {
        if (id) addMemberIfNotPresentAndFetchGroups();
    },[id, currentUser.uid])


    return <>
     <div style={{position: 'relative'}}>
        <SideNav isOpen={sidenavOpen} setIsOpen={setSidenavOpen}  />
    </div>
        <div className='sidebar'>
            <div className='sidebar__user-data'>
                <span className='sidebar__user-image'>
                    <img src={currentUser.photoURL} alt='user_img' />
                </span>
                <span className='sidebar_user-name'> { currentUser.displayName } </span>
               <span className='sidebar__menu'>
                <DropdownMenu setIsOpen={() => setSidenavOpen(prevState => !prevState)} />
{/*                     <Menu onClick={() => setSidenavOpen(prevState => !prevState)} /> */}
                </span> 
            </div>
            <div className='sidebar__groups'>
                { groups.map( group => {
                    return <ChatRoomSidebar
                            key={group.id}
                            id={group.id}
                            groupName={group.name}
                            groupImgSrc={'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
                            groupLastMessage={group.recentMessage.message}
                        />
                }) }
            </div>
        </div>
    </>
}


export default Sidebar;