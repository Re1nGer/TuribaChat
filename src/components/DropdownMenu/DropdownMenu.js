import React, { useContext } from 'react';
import { MoreVertical } from "react-feather";
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { AuthContext } from '../../context/AuthContext';
import AddGroupModal from '../Sidebar/AddGroupModal';
import "./DropdownMenu.scss";

const DropdownMenu = ({ setIsOpen }) => {

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = React.useState(false);

    const { setSelectedRoomId } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setSelectedRoomId('');
            await auth.signOut();
            sessionStorage.clear();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    const handleDropdownClick = (event) => {
        setIsDropdownOpen(prevState => !prevState);
    }

    const handleAddGroupModalClick = () => {
        setIsAddGroupModalOpen(true);
    }

    React.useEffect(() => {
        return () => setSelectedRoomId('');
    },[])

    return ( <>
        <div className={isDropdownOpen ? `dropdown dropdown--open` : 'dropdown'} onClick={handleDropdownClick}>
            <div className="dropbtn"><MoreVertical size={16} /></div>
            <div className="dropdown-content">
                <div className='dropdown-content__link' onClick={() => setIsOpen()}>Settings</div>
                <div className='dropdown-content__link' onClick={handleAddGroupModalClick}>Create a group</div>
                <div className='dropdown-content__link' onClick={handleLogout}>Log Out</div>
            </div>
        </div>
        <AddGroupModal setIsOpen={setIsAddGroupModalOpen} open={isAddGroupModalOpen} />
    </> );
}

export default DropdownMenu;