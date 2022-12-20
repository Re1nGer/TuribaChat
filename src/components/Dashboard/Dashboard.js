import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatRoom from '../ChatRoom/ChatRoom';
import './Dashboard.scss';
import { AuthContext } from '../../context/AuthContext';
import { query, where, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';



const Dashboard = () => {

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

    React.useEffect(() => {
        fetchGroups();
    },[currentUser?.uid])

    return <>
        <div className='dashboard'>
            <Sidebar groups={groups} />
            <ChatRoom />
        </div>
    </>
}

export default Dashboard;