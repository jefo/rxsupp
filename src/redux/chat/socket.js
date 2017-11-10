import { SEND_MESSAGE, SEND_MESSAGE_FAIL, SEND_MESSAGE_SUCCESS, socket } from '../chat/chat';

export default store => next => action => {
    switch (action.type) {
        case SEND_MESSAGE:
            socket.emit(action.type, action.payload);
            socket.on(SEND_MESSAGE_SUCCESS, (msg) => {
                msg.isSent = true;
                store.dispatch({ type: SEND_MESSAGE_SUCCESS, payload: msg });
            });
            socket.on(SEND_MESSAGE_FAIL, (msg) => store.dispatch({ type: SEND_MESSAGE_FAIL, payload: msg }));
            return next(action);
        default:
            return next(action);
    }
    console.log('dispatched', action);
}
