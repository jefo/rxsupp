import io from 'socket.io-client';
import { addMiddleware } from 'redux-dynamic-middlewares';

import store, { chatService } from './redux';
import { actionTypes, actions } from './redux/chat/chat';
import createMiddleware from './redux/chat/createMiddleware';

export default (url) => {
    const socket = io(url);
    addMiddleware(createMiddleware(socket));
    // socket-redux event handler map
    const bindings = {
        [actionTypes.CHAT_INIT]: chatService.init,
        [actionTypes.USER_ADD]: chatService.addUser,
        [actionTypes.USER_UPDATE]: chatService.updateUser,
        [actionTypes.USER_UPDATE_STATUS]: chatService.updateStatus,
        [actionTypes.USER_UPDATE]: chatService.updateUser,
        [actionTypes.MESSAGE_ADD]: chatService.addMessage
    };
    // subscribe socket to events that handled by redux
    Object.keys(bindings).forEach(event => socket.on(event, bindings[event]));
}
