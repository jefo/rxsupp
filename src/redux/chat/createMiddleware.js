import { actions, actionTypes } from './chat';

export default socket => {
    return store => {

        socket.on('reconnect', () => store.dispatch(actions.updateConnection(socket)));

        return next => action => {
            if (action.meta && action.meta.event) {
                let { event } = action.meta;
                socket.emit(event, action.payload);
            }
            return next(action);
        };
    };
};
