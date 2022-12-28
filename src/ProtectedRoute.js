import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {

    const isSignedIn = sessionStorage.getItem('isSignedIn');

    const location = useLocation();

    if (isSignedIn === false || isSignedIn === undefined) 
        return <Navigate to={'/login'}  replace={true} state={{from: location.pathname }} />

    return children ? children : <Outlet />
}


export default ProtectedRoute;