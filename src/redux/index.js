import { createStore, applyMiddleware, combineReducers } from 'redux';
import chat from './chat/chat';
import chatMiddleware from './chat/socket';

export default createStore(
    chat,
    applyMiddleware(chatMiddleware)
);
