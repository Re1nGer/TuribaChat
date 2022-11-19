import React, { useContext, useRef } from 'react';
import { Plus } from 'react-feather';
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import './Modal.scss';
import { AuthContext } from '../../context/AuthContext';
import TextField from '../../UI/Inputs/TextField';

const AddGroupModal = ({open, setIsOpen}) => {

    const { currentUser } = useContext(AuthContext);

    const [groupLink, setGroupLink] = React.useState('');

    const inputRef = useRef();

    const handleAddGroup = async (event) => {

        event.preventDefault();

        try {

            const groupName = inputRef.current;

            if (!groupName) return;

            const docRef = await addDoc(collection(db, "chatRooms"), {
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid,
                members: Array(currentUser.uid),
                name: groupName,
                recentMessage: { message: '' }
            });

            inputRef.current = "";

            await setDoc(doc(db ,'messages', docRef.id), {
                messages: []
            });

            const link = `http://localhost:3000/dashboard/${docRef.id}`

            setGroupLink(link);

        } catch (error) {
            console.log(error);
        }

    }

    const handleCloseAddGroupModal = () => {
        setIsOpen(false);
    }

    return <>
            { open && (
                <div className='modalDialog' onClick={() => setIsOpen(false)}>
                    <div className='modalDialog__inner' onClick={(event) => event.stopPropagation() }>
                        <form onSubmit={handleAddGroup} className="modalDialog__form">
                            <div onClick={handleCloseAddGroupModal} className="close">X</div>
                            <div className='modal__inner'>
                                <h2>Group Name:</h2>
                                <TextField name={'somename'} label={'groupName'}  />
                                <input ref={inputRef} type={'text'} name='groupName' className='modalDialog__input' />
                                <button type='submit' className='modalDialog__button'>Create a group</button>
                                <h3>{groupLink}</h3>
                            </div>
                        </form>
                    </div>
                </div>
            ) }
    </>
}


export default AddGroupModal;