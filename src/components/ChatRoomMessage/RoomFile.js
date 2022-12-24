import React, { useContext } from 'react';
import { getStorage, ref, getDownloadURL, getStream } from 'firebase/storage';
import { AuthContext } from '../../context/AuthContext';
import { File } from 'react-feather';


const RoomFile = ({ size, fileName }) => {

    const { selectedRoomId } = useContext(AuthContext);

    const storage = getStorage();

    const storageRef = ref(storage, `files/${selectedRoomId}/${fileName}`);

    const handleDownload = (event) => {
        getStream(storageRef);
/*         getDownloadURL(storageRef)
        .then((url) => { window.open(url,'_blank'); });
        } */
    }

    function humanFileSize(size) {
        const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
    return (
        <div className='chat-room__file'>
            <div className='chat-room__inner'>
                <File className='chat-room__icon' onClick={handleDownload} />
                <p>{fileName}</p>
            </div>
            <span>{humanFileSize(size)}</span>
        </div>
    )

}


export default RoomFile;