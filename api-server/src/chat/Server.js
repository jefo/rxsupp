import cookie, { serialize } from 'cookie';
import uuid from 'uuid/v1';
import socketio from 'socket.io';

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
} from '../../../common/src/chat';
import User from '../../../common/src/User';
import store from './store';

let colors = {
    '947ee180-d468-11e7-bb25-c99d1ecb7563': '#5D4037',
    'c3d46df0-d45f-11e7-b2da-2589ff87b18f': '#388E3C'
};

export default class Server {

    isRunnin = false;

    constructor(options = {}) {
        if (options.port) {
            this.io = socketio(options.port);
            this.isRunnin = true;
        } else if (options.httpServer) {
            this.httpServer = options.httpServer;
        }
        this.chat = createChat(store);
    }

    start() {
        if (this.isRunnin) {
            return;
        }
        this.io = socketio.listen(this.httpServer);
        this.io.on('connection', this.onConnection);
        this.isRunnin = true;
    }

    stop(callback) {
        this.io.close(() => {
            this.isRunnin = false;
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    onConnection(socket) {
        let ticketId = new Date().getTime().toString();
        console.log('%s connected to %s', socket.id, ticketId);
        socket.join(ticketId);
        let userId = socket.request._query.userId || uuid();
        let user = new User({
            id: userId,
            socketId: socket.id,
            room: ticketId,
            color: colors[userId]
        });
        this.chat.addUser(user);
        socket.broadcast.emit(USER_ADD, user);
        let currentState = this.chat.getState();
        socket.emit(CHAT_INIT, {
            userId: user.id,
            socketId: socket.id,
            users: currentState.users,
            messages: currentState.messages
        });
        const currentUser = this.chat.userSelector(socket.id);
        socket.on(MESSAGE_ADD, (message) => {
            message.socketId = socket.id;
            message.userId = userId;
            let user = store.getState().users.find(u => u.get('id') === userId).toJS();
            message.room = user.room;
            this.chat.addMessage(message);
            socket.to(user.room).emit(MESSAGE_ADD, message);
        });
        socket.on(USER_UPDATE, (user) => {
            this.chat.updateUser(user);
            if (user.room) {
                socket.join(user.room);
                socket.broadcast.emit(USER_UPDATE, user);
                let messages = store.getState().messages
                    .filter(msg => msg.get('room') === user.room).toJS();
                socket.emit(MESSAGES_ADD, messages);
            }
        });
        socket.on('disconnect', () =>
            this.chat.updateUser({ id: userId, status: 'disconnect' }));
    }
}

if (module.hot) {
    module.hot.accept();
}
