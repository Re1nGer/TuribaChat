import React, { useContext } from 'react';
import ChatRoomSidebar from './ChatRoomSidebar';
import './Sidebar.scss';
import { AuthContext } from '../../context/AuthContext';
import SideNav from '../SideNav/SideNav';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import DefaultAvatarImage from './assets/avatardefault.png';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useParams } from 'react-router-dom';


const Sidebar = ({ groups }) => {

    const [sidenavOpen, setSidenavOpen] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    const { width } = useWindowDimensions();

    const { groupId } = useParams();

    if (width < 500 && groupId) return null;

    return <>
        <div style={{position: 'relative'}}>
            <SideNav isOpen={sidenavOpen} setIsOpen={setSidenavOpen}  />
        </div>
        <div className='sidebar'>
            <div className='sidebar__user-data'>
                <span className='sidebar__user-image'>
                    <img src={currentUser?.photoURL} alt='user_img' />
                </span>
                <span className='sidebar_user-name'> { currentUser?.displayName } </span>
               <span className='sidebar__menu'>
                    <DropdownMenu setIsOpen={() => setSidenavOpen(prevState => !prevState)} />
                </span> 
            </div>
            <div className='sidebar__groups'>
                { 
                    groups.map( group => {
                        return <ChatRoomSidebar
                                key={group.id}
                                id={group.id}
                                groupName={group.name}
                                groupImgSrc={DefaultAvatarImage}
                                groupLastMessage={group.recentMessage?.message}
                            />
                    })
                }
            </div>
        </div>
    </>
}


export default Sidebar;