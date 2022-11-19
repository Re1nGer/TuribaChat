import React, { useContext } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../context/AuthContext';


const RoomFile = ({fileName}) => {

    const { selectedRoomId } = useContext(AuthContext);

    const storage = getStorage();

    const storageRef = ref(storage, `files/${selectedRoomId}/${fileName}`);

    const handleDownload = (event) => {
        getDownloadURL(storageRef)
        .then((url) => {
            window.open(url,'_blank');
            });
        }

    return (
        <div className='chat-room-message__content'>
           <p>{fileName}</p>
           <button onClick={handleDownload}>Download</button>
        </div>
    )

}


export default RoomFile;