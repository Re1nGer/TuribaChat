import React from 'react';
import './SignInModal.scss';
import { signInWithGithub, signInWithGoogle } from '../../../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { GitHub } from 'react-feather';
import { Lock } from 'react-feather';

const SignInModal = () => {

    const navigate = useNavigate();

    const { state } = useLocation();


    const handleGoogleLogin = async () => {
        try {

            await signInWithGoogle();

            if (state)
                navigate(state.from, { replace:true });
            else 
                navigate("/dashboard", { replace:true });

            return;
        } catch(error) {
            console.log(error);
        }
    }

    const handleGithubLogin = async () => {
        try {
            await signInWithGithub();
            if (state)
                navigate(state.from, { replace:true });
            else 
                navigate("/dashboard", { replace:true });

            return;

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='sign-in-modal'>
                <div className='sign-in-modal__inner'>
                    <button onClick={handleGoogleLogin} className='sign-in-modal-button'>
                        <Lock />
                        Sign In With Google
                    </button>
                    <button onClick={handleGithubLogin} className='btn btn--github'>
                        <GitHub />
                        Sign In With GitHub
                    </button>
                </div>
        </div>
    )
}


export default SignInModal;