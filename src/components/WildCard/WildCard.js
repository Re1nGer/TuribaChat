import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./WildCard.scss";


const WildCard = () => {

    const navigate = useNavigate();

    return <div className='wild-card'> 
        <div>
            <h1>No Requested Page Exists</h1>
            <button onClick={() => navigate("/login", {replace:true})}>Go back</button>
        </div>
    </div>

}

export default WildCard;