import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { auth, db } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import './Popups.scss';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

const GroupsDeletePopup = () => {

    const {
            isGroupsDeletePopupOpen,
            setIsGroupsDeletePopupOpen,
            setSelectedRoomId,
            currentUser
        } = useContext(AuthContext);

    const navigate = useNavigate();

    const getAllGroupsCreatedByUser = async () => {
        try {
            const q = query(collection(db, 'chatRooms'), where('createdBy', '==', currentUser?.uid));
            const { docs } = await getDocs(q);
            return docs;
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    const deleteAllGroupsCreatedByUser = async () => {
        try {
            const groups = await getAllGroupsCreatedByUser();

            if (groups.length === 0) return;

            groups.forEach(group =>{
                deleteDoc(doc(db, 'chatRooms', group.id))
            });

        } catch (error) {}
    }

    const handleLogout = async () => {
        try {
            await deleteAllGroupsCreatedByUser();
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