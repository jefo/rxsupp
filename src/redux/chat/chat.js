import { OrderedMap } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';

export const USER_CONNECTED = 'CONNECTION_OPEN';
export const USER_EMAIL_SEND = 'USER_EMAIL_SEND';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const RECEIVE_MESSAGE_SUCCESS = 'RECEIVE_MESSAGE_SUCCESS';
export const RECEIVE_MESSAGE_FAIL = 'RECEIVE_MESSAGE_FAIL';


export const sendMessage = (text) => {
    let timestamp = new Date().getTime();
    let message = {
        timestamp,
        text,
        isInc: false,
        isSent: false,
        userId: 1
    };
    return {
        type: SEND_MESSAGE,
        payload: message
    };
};

const messagesInitialState = OrderedMap();

const messages = (state = messagesInitialState, { type, payload }) => {
    switch (type) {
        case SEND_MESSAGE:
        case SEND_MESSAGE_SUCCESS:
        case SEND_MESSAGE_FAIL:
            return state.set(payload.timestamp, payload);
        default:
            return state;
    }
}

const usersInitialState = OrderedMap();

const users = (state = usersInitialState, { type, payload }) => {
    switch (type) {
        case USER_CONNECTED:
            return state.set(payload, { id: payload });
        case USER_EMAIL_SEND:
            return state.set(payload.id, payload)
        default:
            return state;
    }
}

export default combineReducers({
    users,
    messages
});
