import io from 'socket.io-client';
import { addMiddleware } from 'redux-dynamic-middlewares';

import store, { chatService } from './redux';
import { actionTypes } from './redux/chat/chat';
import createMiddleware from './redux/chat/createMiddleware';

export default (url) => {
    const socket = io(url);
    addMiddleware(createMiddleware(socket));
    // socket-redux event handler map
    const bindings = {
        [actionTypes.USER_ADD]: chatService.addUser,
        [actionTypes.USER_UPDATE_STATUS]: chatService.updateStatus,
        [actionTypes.MESSAGE_SEND]: chatService.sendMessage,
        [actionTypes.USER_UPDATE]: chatService.updateUser
    };

    // subscribe socket to events that handled by redux
    Object.keys(bindings).forEach(event => socket.on(event, bindings[event]));
}
