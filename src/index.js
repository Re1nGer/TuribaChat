require('file-loader?name=[name].[ext]!./index.html');
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { AuthContextProvider } from './context/AuthContext';
import ChatContextProvider from './context/ChatContext';


const root = document.getElementById('root');

ReactDOM.render(
        <AuthContextProvider>
            <ChatContextProvider>
                <App />
            </ChatContextProvider>
        </AuthContextProvider>,
 root);