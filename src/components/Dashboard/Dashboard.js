import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatRoom from '../ChatRoom/ChatRoom';
import './Dashboard.scss';
import { AuthContext } from '../../context/AuthContext';
import { query, where, collection, onSnapshot, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import { renderToString } from 'react-dom/server'

const Dashboard = ({ groupId }) => {

    const [groups, setGroups] = React.useState([]);

    const { currentUser, isEmojiTabOpen, debouncedSetText } = React.useContext(AuthContext);

    const fetchGroups = () => {
        if (currentUser?.uid) {
            const querySnapshot = query(collection(db, 'chatRooms'), where('members', 'array-contains', currentUser.uid));
            return onSnapshot(querySnapshot, (snap) => {

                const { docs } = snap;

                const groups = docs.map(group => ({id: group.id, ...group.data()}))

                setGroups(groups);
            });
        }
    }

    const setGroup = () => {
        const docRef = doc(db, "chatRooms", groupId);
        if (currentUser?.uid)
            updateDoc(docRef, { members: arrayUnion(currentUser.uid) })
    }

    const handleEmojiClick = (e) => {
        const htmlEmoji = renderToString(<Emoji unified={e.unified} size={20} />);
        debouncedSetText(prevState => prevState.concat(htmlEmoji));
    }

    React.useEffect(() => {
        if (groupId) setGroup();
        fetchGroups();

        return () => fetchGroups();
    },[currentUser?.uid, groupId])

    return <>
        <div className='dashboard'>
            <Sidebar groups={groups} />
            <ChatRoom />
            { isEmojiTabOpen &&
                <div className='emoji__tab'>
                    <EmojiPicker
                        width={'100%'}
                        searchDisabled={true}
                        previewConfig={{showPreview: false}}
                        autoFocusSearch={false}
                        emojiStyle='apple'
                        theme='light'
                        emojiVersion={'12.0'}
                        onEmojiClick={handleEmojiClick}
                        lazyLoadEmojis={true} 
                        height={'100%'}
                        />
                </div>
            }
        </div>
    </>
}

export default Dashboard;