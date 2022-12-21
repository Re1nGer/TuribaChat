import React from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';



const DashboardView = () => {

    const { groupId } = useParams();

    return <>
        <Dashboard groupId={groupId} />
    </>
}


export default DashboardView;