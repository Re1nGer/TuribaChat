import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatRoom from '../ChatRoom/ChatRoom';
import './Dashboard.scss';
import { AuthContext } from '../../context/AuthContext';
import { query, where, collection, onSnapshot, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const Dashboard = ({ groupId }) => {

    const [groups, setGroups] = React.useState([]);

    const { currentUser } = React.useContext(AuthContext);

    const fetchGroups = () => {
        if (currentUser?.uid) {
            const querySnapshot = query(collection(db, 'chatRooms'), where('members', 'array-contains', currentUser.uid));
            onSnapshot(querySnapshot, (snap) => {

                const { docs } = snap;

                const groups = docs.map(group => ({id: group.id, ...group.data()}))

                setGroups(groups);
            });
        }
    }

    const setGroup = () => {
        const docRef = doc(db, "chatRooms", groupId);
        if (currentUser?.uid)
            updateDoc(docRef, { members: arrayUnion(currentUser.uid) })
    }

    React.useEffect(() => {
        if (groupId) setGroup();
        fetchGroups();
    },[currentUser?.uid, groupId])

    return <>
        <div className='dashboard'>
            <Sidebar groups={groups} />
            <ChatRoom />
        </div>
    </>
}

export default Dashboard;