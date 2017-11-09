import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import chat, { saga } from './chat/chat';

const sagaMiddleware = createSagaMiddleware();

export default createStore(
    chat,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(saga);
