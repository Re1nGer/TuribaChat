import React, { useState } from 'react';
import * as signalR from "@microsoft/signalr";

function SignalR() {

    const [inputText, setInputText] = useState('');

    const [messages, setMessages] = useState([]);

    const [connection, setConnection] = useState();

    const sendMessage = async (e) => {
        setInputText(e.target.value);
        if (connection) await connection.send("SendMessage", e.target.value);
    }

    React.useEffect(() => {
        const connect = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5259/Chat')
            .withAutomaticReconnect()
            .build();
        
        setConnection(connect);
    },[])


    React.useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                connection.on("ReceiveMessage", (message) => {
                    console.log(message);
                    setMessages(prevState => [...prevState, message]);
                });
                })
            .catch((error) => console.log(error));
        }

    },[connection])

    return ( <>
        <input type={'text'} value={inputText} onChange={sendMessage} />
        {messages.map((message, index) => <div key={index}>{message}</div>)}
    </> );
}

export default SignalR;