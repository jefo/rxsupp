import { OrderedMap } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';

export const ADD_USER = 'ADD_USER';
export const SET_USER_OFFLINE = 'SET_USER_OFFLINE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
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
        type: SEND_MESSAGE,
        payload: message
    };
};

export const connectWithUser = (id) => {
    return { type: CONNECT_WITH_USER, payload: id }
}

const messagesInitialState = OrderedMap();

const messages = (state = messagesInitialState, { type, payload }) => {
    switch (type) {
        case ADD_USER:
            return state.merge(payload.messages);
        case ADD_MESSAGE:
        case SEND_MESSAGE:
            return state.set(payload.timestamp, payload);
        default:
            return state;
    }
}

const usersInitialState = OrderedMap();

const users = (state = usersInitialState, { type, payload }) => {
    switch (type) {
        case ADD_USER:
            return state.merge(payload.users);
        case SET_USER_OFFLINE:
            let { user } = payload;
            return state.set(user.id, user)
        default:
            return state;
    }
}

export default combineReducers({
    users,
    messages
});
