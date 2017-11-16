import { createStore, applyMiddleware, combineReducers } from 'redux';
import Immutable from 'immutable';
import { createLogger } from 'redux-logger';
import chat from './chat/chat';
import chatMiddleware from './chat/middleware';

const logger = createLogger({
    stateTransformer: (state) => {
        let newState = {};
        for (var i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }
        return newState;
    }
});

const store = window.store = createStore(
    chat,
    applyMiddleware(logger, chatMiddleware),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
