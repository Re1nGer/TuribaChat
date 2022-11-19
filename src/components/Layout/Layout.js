import { Outlet } from 'react-router-dom';
import Container from '../Container/Container';
import React from 'react';
import Header from '../Navbar/Header';

const Layout = () => {

    return <>
        <Header />
        <Container>
            <Outlet />
        </Container>
    </>
}


export default Layout;