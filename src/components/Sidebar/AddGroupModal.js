import React, { useContext, useRef } from 'react';
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from '../../../firebase';
import './Modal.scss';
import { AuthContext } from '../../context/AuthContext';
import { ModalLink } from './ModalLink';

const AddGroupModal = ({open, setIsOpen}) => {

    const { currentUser } = useContext(AuthContext);

    const [groupLink, setGroupLink] = React.useState('');

    const inputRef = useRef();

    const handleAddGroup = async (event) => {

        event.preventDefault();

        try {

            const groupName = inputRef.current;

            if (!groupName.value) return;

            const docRef = await addDoc(collection(db, "chatRooms"), {
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid,
                members: Array(currentUser.uid),
                name: groupName.value,
                recentMessage: { message: '' }
            });

            inputRef.current.value = "";

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

    React.useEffect(() => {
        return () => setGroupLink('');
    },[])

    return <>
            { open && (
                <div className='modalDialog' onClick={() => setIsOpen(false)}>
                    <div className='modalDialog__inner' onClick={(event) => event.stopPropagation() }>
                        <form onSubmit={handleAddGroup} className="modalDialog__form">
                            <div onClick={handleCloseAddGroupModal} className="close">X</div>
                            <div className='modal__inner'>
                                <h2>Group Name:</h2>
                                <input ref={inputRef} type={'text'} name='groupName' className='modalDialog__input' />
                                <button type='submit' className='modalDialog__button'>Create a group</button>
                                 { groupLink !== '' ? <>
                                    <h3 className='modal__link-heading'>Group Link</h3>
                                    <ModalLink groupLink={groupLink} />
                                 </>  : null }
                            </div>
                        </form>
                    </div>
                </div>
            ) }
        </>
    }

export default AddGroupModal;