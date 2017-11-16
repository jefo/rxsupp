import {
    MESSAGE_ADD,
    MESSAGE_SEND,
    USER_UPDATE,
    SET_USER_OFFLINE,
    CONNECT_WITH_USER,
    LOGIN_USER,
    sendMessage,
    socket
} from '../chat/chat';
import io from 'socket.io-client';

export default store => {

    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('connect', socket.id);
        let login = sessionStorage.getItem('login');
        login = login ? login : socket.id;
        socket.emit(LOGIN_USER, { login });
    });

    socket.on(USER_UPDATE, (payload) => store.dispatch({ payload, type: USER_UPDATE }));

    socket.on(SET_USER_OFFLINE, (payload) => store.dispatch({ payload, type: SET_USER_OFFLINE }));

    socket.on(MESSAGE_ADD, (payload) => store.dispatch({ payload, type: MESSAGE_ADD }));

    socket.on(LOGIN_USER, (payload) => {
        payload.isCurrent = socket.id === payload.id;
        store.dispatch({ payload, type: LOGIN_USER });
        sessionStorage.setItem('login', payload.login);
    });

    return next => action => {
        switch (action.type) {
            case MESSAGE_SEND:
                let users = store.getState().users.toJS();
                action.payload.socketId = socket.id;
                let login = action.payload.text.match(/[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(com|org|ru)/g);
                if (login && login.length) {
                    login = login[0];
                    let user = [socket.id];
                    socket.emit(LOGIN_USER, Object.assign(user, { login }));
                } else {
                    socket.emit(action.type, action.payload);
                }
                return next(action);
            default:
                return next(action);
        }
    }
}

