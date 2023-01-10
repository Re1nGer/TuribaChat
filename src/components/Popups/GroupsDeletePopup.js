import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import './Popups.scss';

const GroupsDeletePopup = () => {

    const { isGroupsDeletePopupOpen,
            setIsGroupsDeletePopupOpen,
            setSelectedRoomId
        } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setSelectedRoomId('');
            await auth.signOut();
            sessionStorage.clear();
            navigate('/');
            setIsGroupsDeletePopupOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = () => setIsGroupsDeletePopupOpen(false);

    if (!isGroupsDeletePopupOpen) return null;

    return (
        <div className='groups__delete'>
            <div className='groups__delete-inner'>
                <div className='groups__delete-text'>
                    <h2>After you log out, all your groups will be permanently deleted.</h2>
                </div>
                <div className='groups__delete-actions'>
                    <button className='groups__delete-actions--okay' onClick={handleLogout}>Okay</button>
                    <button className='groups__delete-actions--cancel' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default GroupsDeletePopup;