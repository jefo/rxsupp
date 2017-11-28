import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import io from 'socket.io-client';

import Chat from './components/chat/chat';
import {
    CHAT_INIT,
    USER_ADD,
    USER_UPDATE,
    MESSAGE_ADD,
    createChat
} from '../../rxsupp.core/src/chat';
import store from './redux/store';

const socket = io('http://localhost:3000');
const chat = createChat(store);

// socket-redux event handler map
const bindings = {
    [CHAT_INIT]: chat.init,
    [USER_ADD]: chat.addUser,
    [USER_UPDATE]: chat.updateUser,
    [MESSAGE_ADD]: chat.addMessage
};

// subscribe socket to events that handled by redux
Object.keys(bindings).forEach(event => socket.on(event, bindings[event]));

render(
    <Provider store={store}>
        <Chat socket={socket} chat={chat} />
    </Provider>,
    document.getElementById('root')
);
