import { Outlet } from 'react-router-dom';
import Container from '../Container/Container';
import React from 'react';
import Header from '../Navbar/Header';
import GroupsDeletePopup from '../Popups/GroupsDeletePopup';

const Layout = () => {

    return <>
        <Header />
        <GroupsDeletePopup />
        <Container>
            <Outlet />
        </Container>
    </>
}


export default Layout;