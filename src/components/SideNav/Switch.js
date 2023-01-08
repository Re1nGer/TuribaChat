import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { db } from '../../../firebase';
import { AuthContext } from '../../context/AuthContext';

function Switch() {

    const [isGroupsDeletedAfterLogout, setIsGroupsDeletedAfterLogout] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    const [id, setId] = useState('');

    const handleUserSettings = async (e) => {

        console.log(id);

        await updateDoc(doc(db, 'users', id), {
            isGroupsDeletedAfterLogout: !isGroupsDeletedAfterLogout
        });
    }

    const fetchUserSettings = async () => {
        const docRef = query(collection(db, 'users'), where('uid', '==', currentUser?.uid));

        const user = (await getDocs(docRef));

        setIsGroupsDeletedAfterLogout(user.docs()[0]?.isGroupsDeletedAfterLogout);
    }

    React.useEffect(() => {
        fetchUserSettings();
    },[currentUser?.uid])

    return <label className='switch'>
        <input type='checkbox' onChange={handleUserSettings} value={isGroupsDeletedAfterLogout} />
        <span className='slider round'></span>
    </label>;
}

export default Switch;
