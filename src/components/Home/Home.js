import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { auth, signInWithGoogle } from '../../firebase/firebase';
import { Link } from 'react-router-dom';


const Home = () => {

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);


    const onLogout = () => {
        auth.signOut().then(() => console.log('sing out succesfful'))
    }

    const onLogin = async () => {
        await signInWithGoogle();
    }

    React.useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user)
                setIsLoggedIn(true)
            else
                setIsLoggedIn(false)
        })
    },[])

    return <>
        <div>{ isLoggedIn ? <button onClick={onLogout}>Log out</button>
            : <button onClick={onLogin}>Log in</button>}
        </div>
        <Link to={'/dashboard'}>To dashboard</Link>
    </>
}


export default Home;