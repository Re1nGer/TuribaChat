import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatRoom from '../ChatRoom/ChatRoom';
import './Dashboard.scss';



const Dashboard = () => {

    return <>
        <div className='dashboard'>
            <Sidebar />
            <ChatRoom />
        </div>
    </>
}

export default Dashboard;