import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import chat, { saga } from './chat/chat';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    chat,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(saga);
