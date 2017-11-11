import { OrderedMap } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';

export const USER_CONNECTED = 'USER_CONNECTED';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
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
        userId: null
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
        case USER_LOGIN_SUCCESS:
            return state.set(payload.id, payload)
        default:
            return state;
    }
}

export default combineReducers({
    users,
    messages
});
