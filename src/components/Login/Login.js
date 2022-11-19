import React from 'react';
import SignInModal from '../SignInModal/SignInModal';
import "./Login.scss";


const Login = () => {

    return <>
        <div className='login'>
            <SignInModal />
        </div>
    </>
}

export default Login;