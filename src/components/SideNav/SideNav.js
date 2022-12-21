import React, { useContext } from 'react';
import "./SideNav.scss";
import { auth } from '../../../firebase';
import { ArrowLeft, Bell, Lock, LogOut, Settings } from 'react-feather';
import { AuthContext } from '../../context/AuthContext';

const SideNav = ({ isOpen, setIsOpen }) => {

    const { currentUser } = useContext(AuthContext);

    const handleLogout = () => {
        try {
            auth.signOut();
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <div className={`sidenav__container ${isOpen ? "sidenav__container--open": ''}`}>
            <div className='sidenav__header'>
                <span className='sidenav__header-btn-close'><ArrowLeft color='#fff' onClick={() => setIsOpen(false)} /></span>
                <button className='sidenav__header-btn-logout' onClick={() => auth.signOut()}>
                    <LogOut size={15} />
                    Logout
                </button>
            </div>
            <ul className='sidenav__content'>
                <li className='sidenav__content-item'>
                    <div className='sidenav__user-info'>
                        <img className='sidenav__user-image' src={currentUser.photoURL} alt='user photo'/>
                        <div className='sidenav__user-data'>
                            <div className='sidenav__user-name'>{currentUser.displayName}</div>
                            <div className='sidenav__user-bio'>...</div>
                        </div>
                    </div>
                </li>
                <li className='sidenav__content-item'>
                    <div className='sidenav__content-option'>
                        <div><Bell /></div>
                        <div className='sidenav__content-text'>Notifications</div>
                    </div>
                </li>
                <li className='sidenav__content-item'>
                    <div className='sidenav__content-option'>
                        <div><Settings /></div>
                        <div className='sidenav__content-text'>Settings</div>
                    </div>
                </li>
                <li className='sidenav__content-item'>
                    <div className='sidenav__content-option'>
                        <div><Lock /></div>
                        <div className='sidenav__content-text'>Privacy</div>
                    </div>
                </li>
            </ul>   
        </div>
    </>
}


export default SideNav;