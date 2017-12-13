import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import io from 'socket.io-client';
import uuid from 'uuid/v1';

import Chat from './components/chat/chat';
import {
    CHAT_INIT,
    USER_ADD,
    USER_UPDATE,
    MESSAGE_ADD,
    MESSAGES_ADD,    
    createChat,
} from '../../common/src/chat';
import store from './redux/store';

let ioOptions = {};

if(localStorage.userId) {
    ioOptions.query = { userId: localStorage.userId }
}

const socket = io('http://localhost:8080', ioOptions);
const chat = createChat(store);

// socket-redux event handler map
const bindings = {
    [USER_ADD]: chat.addUser,
    [USER_UPDATE]: chat.updateUser,
    [MESSAGE_ADD]: chat.addMessage,
    [MESSAGES_ADD]: chat.addMessages
};

// subscribe socket to events that handled by redux
Object.keys(bindings).forEach(event => socket.on(event, bindings[event]));

socket.on(CHAT_INIT, (payload) => {
    chat.init(payload);
    localStorage.userId = payload.userId
});

render(
    <Provider store={store}>
        <Chat socket={socket} chat={chat} />
    </Provider>,
    document.getElementById('root')
);
