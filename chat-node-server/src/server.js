import cookie from 'cookie';
import uuid from 'uuid/v1';

import {
    createChat,
    USER_SIGN_IN,
    MESSAGE_SEND,
    CHAT_READY,
    CHAT_INIT,
    USER_ADD,
    USER_UPDATE,
    USER_SET_ROOM,
    MESSAGE_ADD,
    MESSAGES_ADD
} from '../../rxsupp.core/src/chat';
import Message from '../../rxsupp.core/src/Message';
import User from '../../rxsupp.core/src/User';
import store from './store';

if (module.hot) {
    module.hot.accept();
}

let colors = {
    '947ee180-d468-11e7-bb25-c99d1ecb7563': '#5D4037',
    'c3d46df0-d45f-11e7-b2da-2589ff87b18f': '#388E3C'
};

export default (port = 3000) => {
    const io = require('socket.io')(port);
    console.log('server runnin', port);
    const serve = (io, socket) => {
        let ticketId = new Date().getTime().toString();
        socket.join(ticketId);
        const chat = createChat(store);
        let userId = socket.request._query.userId || uuid();
        let user = new User({
            id: userId,
            socketId: socket.id,
            room: ticketId,
            color: colors[userId]
        });
        chat.addUser(user);
        socket.broadcast.emit(USER_ADD, user);
        let currentState = chat.getState();
        socket.emit(CHAT_INIT, {
            userId: user.id,
            socketId: socket.id,
            users: currentState.users,
            messages: currentState.messages
        });
        const currentUser = chat.userSelector(socket.id);
        socket.on(MESSAGE_ADD, (message) => {
            message.socketId = socket.id;
            message.userId = userId;
            let user = store.getState().users.find(u => u.get('id') === userId).toJS();
            message.room = user.room;
            chat.addMessage(message);
            socket.to(user.room).emit(MESSAGE_ADD, message);
        });
        socket.on(USER_UPDATE, (user) => {
            chat.updateUser(user);
            if (user.room) {
                socket.join(user.room);
                socket.broadcast.emit(USER_UPDATE, user);
                let messages = store.getState().messages
                    .filter(msg => msg.get('room') === user.room).toJS();
                socket.emit(MESSAGES_ADD, messages);
            }
        });
        socket.on('disconnect', () =>
            chat.updateUser({ id: userId, status: 'disconnect' }));
    };

    io.on('connection', (socket) => {
        serve(io, socket);
    });

    return io;
};