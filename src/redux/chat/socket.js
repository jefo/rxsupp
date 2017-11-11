import {
    SEND_MESSAGE,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_SUCCESS,
    USER_CONNECTED,
    USER_EMAIL_SEND,
    sendMessage,
    socket
} from '../chat/chat';
import io from 'socket.io-client';

export default store => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
        store.dispatch({ type: USER_CONNECTED, payload: socket.id });
        // todo: check is operator online. 
        store.dispatch(sendMessage('Привет. Если не затруднит, напишите адрес электронной почты, тогда мы сможем прислать Вам ответ на почту.'))
    });
    return next => action => {
        console.log('dispatched', action);
        switch (action.type) {
            case SEND_MESSAGE:
                action.payload.userId = socket.id;
                let email = action.payload.text.match(/[a-zA-z0-9_.]+@[a-zA-Z0-9_.]+\.(com|org|whatever)/g);
                if (email && email.length) {
                    email = email[0];
                    let name = email.match(/^([^@]*)@/)[1];
                    store.dispatch({ type: USER_EMAIL_SEND, payload: { email, name, id: socket.id } });
                }
                socket.emit(action.type, action.payload);
                socket.on(SEND_MESSAGE_SUCCESS, (msg) => {
                    msg.isSent = true;
                    store.dispatch({ type: SEND_MESSAGE_SUCCESS, payload: msg });
                });
                socket.on(SEND_MESSAGE_FAIL, (msg) => store.dispatch({ type: SEND_MESSAGE_FAIL, payload: msg }));
                console.log('state', store.getState().users.toJS())
                return next(action);
            default:
                return next(action);
        }
    }
}

