import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {

    const { currentUser } = useContext(AuthContext)

    const location = useLocation();

    if (!currentUser) 
        return <Navigate to={'/login'}  replace={true} state={{from: location.pathname }} />

    return children ? children : <Outlet />
}


export default ProtectedRoute;