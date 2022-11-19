import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginView from './pages/LoginView';
import ProtectedRoute from './ProtectedRoute'
import DashboardView from './pages/DashboardView';
import WildCardView from './pages/WildCardView';
import './App.scss';
import { ChatContext } from './context/ChatContext';

export function App() {


    const { deleteAllCreatedGroups } = useContext(ChatContext);

    useEffect(() => {

        window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();

        // Chrome requires returnValue to be set.
        return deleteAllCreatedGroups();
    });

    return () => deleteAllCreatedGroups();

    },[])

    return <>
        <Router>
            <Routes>
                <Route element={<Layout />}>
{/*                     <Route path='/' element={<HomeView />}/> */}
                    <Route index element={<LoginView />} />
                    <Route index path='/login' element={<LoginView />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path='/dashboard' element={<DashboardView />} />
                        <Route path='/dashboard/:id' element={<DashboardView />} />
                    </Route>
                    <Route path='*' element={<WildCardView />} />
                </Route>
            </Routes>
        </Router>
    </>
}
