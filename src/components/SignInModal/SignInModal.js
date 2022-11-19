import React from 'react';
import './SignInModal.scss';
import { signInWithGithub, signInWithGoogle } from '../../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { GitHub } from 'react-feather';

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
                    <img className='sign-in-modal-image' src='http://www.androidpolice.com/wp-content/themes/ap2/ap_resize/ap_resize.php?src=http%3A%2F%2Fwww.androidpolice.com%2Fwp-content%2Fuploads%2F2015%2F10%2Fnexus2cee_Search-Thumb-150x150.png&w=150&h=150&zc=3' />
                    <button onClick={handleGoogleLogin} className='btn sign-in-modal-button'>
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