import { OrderedMap } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';

export const USER_ADD = 'USER_ADD';
export const CHAT_UPDATE = 'CHAT_UPDATE';
export const USER_UPDATE = 'USER_UPDATE';
export const SET_USER_OFFLINE = 'SET_USER_OFFLINE';
export const MESSAGE_ADD = 'MESSAGE_ADD';
export const MESSAGE_SEND = 'MESSAGE_SEND';
export const LOGIN_USER = 'USER_LOGIN';
export const CONNECT_WITH_USER = 'CONNECT_WITH_USER';
export const OPERATOR_CONNECTED = 'OPERATOR_CONNECTED';
export const REQUEST_MASSAGES_HISTORY = 'REQUEST_MASSAGES_HISTORY';

export const sendMessage = (text) => {
    let timestamp = new Date().getTime();
    let message = {
        timestamp,
        text,
        userId: null
    };
    return {
        type: MESSAGE_SEND,
        payload: message
    };
};

export const connectWithUser = (id) => {
    return { type: CONNECT_WITH_USER, payload: id };
}

const messagesInitialState = OrderedMap();

const messages = (state = messagesInitialState, { type, payload }) => {
    switch (type) {
        case CHAT_UPDATE:
            return state.merge(payload.messages);
        case MESSAGE_ADD:
        case MESSAGE_SEND:
            return state.set(payload.timestamp, payload);
        default:
            return state;
    }
}

const usersInitialState = OrderedMap();

const users = (state = usersInitialState, { type, payload }) => {
    switch (type) {
        case CHAT_UPDATE:
            return state.merge(payload.users);
        case USER_UPDATE:
            return state.set(payload.login, payload);
        case SET_USER_OFFLINE:
        case LOGIN_USER:
            return state.set(payload.login, payload)
        default:
            return state;
    }
}

export default combineReducers({
    users,
    messages
});
