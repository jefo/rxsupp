import {
    ADD_MESSAGE,
    SEND_MESSAGE,
    ADD_USER,
    SET_USER_OFFLINE,
    CONNECT_WITH_USER,
    sendMessage,
    socket
} from '../chat/chat';
import io from 'socket.io-client';

export default store => {

    const socket = io('http://localhost:3000');

    socket.on(ADD_USER, (payload) => {
        payload.users[socket.id].isCurrent = true;
        store.dispatch({ payload, type: ADD_USER })
    });
    socket.on(SET_USER_OFFLINE, (payload) => store.dispatch({ payload, type: SET_USER_OFFLINE }));
    socket.on(ADD_MESSAGE, (payload) => store.dispatch({ payload, type: ADD_MESSAGE }));

    return next => action => {
        switch (action.type) {
            case SEND_MESSAGE:
                action.payload.userId = socket.id;
                let email = action.payload.text.match(/[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(com|org|ru)/g);
                if (email && email.length) {
                    email = email[0];
                    socket.emit(USER_LOGIN, { id: socket.id, });
                } else {
                    socket.emit(action.type, action.payload);
                }
                return next(action);
            default:
                return next(action);
        }
    }
}

