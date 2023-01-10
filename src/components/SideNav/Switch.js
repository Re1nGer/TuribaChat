import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { db } from '../../../firebase';
import { AuthContext } from '../../context/AuthContext';

function Switch() {

    const [isGroupsDeletedAfterLogout, setIsGroupsDeletedAfterLogout] = React.useState(false);

    const { currentUser } = useContext(AuthContext);

    const [isLoading, setIsLoading] = React.useState(false);

    const [id, setId] = useState('');

    const handleUserSettings = async (e) => {
        try {
            setIsLoading(true);
            await updateDoc(doc(db, 'users', id), {
                isGroupsDeletedAfterLogout: !isGroupsDeletedAfterLogout
            });
            setIsGroupsDeletedAfterLogout(prevState => !prevState);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchUserSettings = async () => {
        const docRef = query(collection(db, 'users'), where('uid', '==', currentUser?.uid));

        const user = await getDocs(docRef);

        const userSetting = user.docs[0];

        setIsGroupsDeletedAfterLogout(userSetting?.data()?.isGroupsDeletedAfterLogout);

        setId(userSetting?.id);
    }

    console.log(isGroupsDeletedAfterLogout);

    React.useEffect(() => {
        if (currentUser?.uid) fetchUserSettings();
    },[currentUser?.uid])

    return <label className='switch'>
        <input type='checkbox' onChange={handleUserSettings} disabled={isLoading} checked={isGroupsDeletedAfterLogout} value={isGroupsDeletedAfterLogout} />
        <span className='slider round'></span>
    </label>;
}

export default Switch;
