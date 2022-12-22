import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginView from './pages/LoginView';
import ProtectedRoute from './ProtectedRoute'
import DashboardView from './pages/DashboardView';
import WildCardView from './pages/WildCardView';
import './App.scss';
import SignalR from './pages/SignalR';

export function App() {

    return <>
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<LoginView />} />
                    <Route index path='/login' element={<LoginView />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path='/dashboard' element={<DashboardView />} />
                        <Route path='/dashboard/:groupId' element={<DashboardView />} />
                    </Route>
                    <Route path='/test' element={<SignalR />} />
                    <Route path='*' element={<WildCardView />} />
                </Route>
            </Routes>
        </Router>
    </>
}
