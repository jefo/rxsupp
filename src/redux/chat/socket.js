import {
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_SUCCESS,
    USER_CONNECTED,
    USER_LOGIN,
    USER_LOGIN_SUCCESS,
    sendMessage,
    socket
} from '../chat/chat';
import io from 'socket.io-client';

export default store => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
        let email;
        if (localStorage.getItem('user')) {
            email = JSON.parse(localStorage.getItem('user')).email;
        } else {
            email = 'anon@eewew.com';
        }
        socket.emit(USER_LOGIN, email);
        store.dispatch({ type: USER_CONNECTED, payload: socket.id });
        // todo: check is operator online. 
        store.dispatch(sendMessage('Привет. Если не затруднит, напишите адрес электронной почты, тогда мы сможем прислать Вам ответ на почту.'))
    });
    socket.on(SEND_MESSAGE_SUCCESS, (msg) => {
        msg.isSent = true;
        store.dispatch({ type: SEND_MESSAGE_SUCCESS, payload: msg });
    });
    socket.on(SEND_MESSAGE_FAIL, (msg) => store.dispatch({ type: SEND_MESSAGE_FAIL, payload: msg }));
    socket.on(USER_LOGIN_SUCCESS, ({ email, role }) => {
        let name = role === 'operator' ? 'Operator' : email.match(/^([^@]*)@/)[1];
        let user = { id: socket.id, email, name };
        store.dispatch({ type: USER_LOGIN_SUCCESS, payload: user });
    });
    return next => action => {
        console.log('dispatched', action);
        console.log('state', store.getState().users.toJS())
        switch (action.type) {
            case SEND_MESSAGE:
                action.payload.userId = socket.id;
                let email = action.payload.text.match(/[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(com|org|ru)/g);
                if (email && email.length) {
                    email = email[0];
                    socket.emit(USER_LOGIN, email);
                } else {
                    socket.emit(action.type, action.payload);
                }
                return next(action);
            case USER_LOGIN_SUCCESS:
                localStorage.setItem('user', JSON.stringify(action.payload));
                return next(action);
            default:
                return next(action);
        }
    }
}

