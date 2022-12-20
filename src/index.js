require('file-loader?name=[name].[ext]!./index.html');
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { AuthContextProvider } from './context/AuthContext';


const root = document.getElementById('root');

ReactDOM.render(
        <AuthContextProvider>
            <App />
        </AuthContextProvider>,
 root);