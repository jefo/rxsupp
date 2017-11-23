import { OrderedMap, fromJS } from 'immutable';
import { call, put, takeEvery, takeLatest, actionChannel } from 'redux-saga/effects';
import { combineReducers, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';

window.Immutable = require('immutable');

export const Statuses = {
    CONNECTED: 'CONNECTED',
    RECONNECTING: 'RECONNECTING',
    RECONNECT_ERROR: 'RECONNECT_ERROR',
    RECONNECT_FAILED: 'RECONNECT_FAILED',
    DISCONNECT: 'DISCONNECT',
    ERROR: 'ERROR',
    CONNECT_TIMEOUT: 'CONNECT_TIMEOUT',
    CONNECTION_ERROR: 'CONNECTION_ERROR'
};

export const actionTypes = {
    // chat
    CHAT_UPDATE: 'CHAT_UPDATE',

    // user   
    USER_ADD: 'USER_ADD',
    USER_UPDATE: 'USER_UPDATE',
    USER_LOGIN: 'USER_LOGIN',
    USER_UPDATE_STATUS: 'USER_UPDATE_STATUS',

    // message
    MESSAGE_ADD: 'MESSAGE_ADD',
    MESSAGE_SEND: 'MESSAGE_SEND',

    // connection
    CONNECTION_UPDATE: 'CONNECTION_UPDATE',
    CONNECTION_UPDATE_STATUS: 'CONNECTION_UPDATE_STATUS',
};

export const actions = {
    sendMessage: (text) => {
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
    },
    connectWithUser: (id) => ({ type: CONNECT_WITH_USER, payload: id }),
    updateUser: (user) => ({ type: USER_UPDATE, payload: user }),
    addUser: (user) => ({ type: USER_ADD, payload: user }),
    updateStatus: (status) => ({ type: USER_UPDATE_STATUS, payload: { socketId, status } }),
    updateConnection: (socket) => ({ type: CONNECTION_UPDATE, payload: { socket } }),
    updateConnectionStatus: (socket, status) => ({ type: CONNECTION_UPDATE, payload: { socket, status } }),
};

export const selectors = {
    selectUserBySocketId: socketId => createSelector(
        state => state.users,
        users => users.find(user => user.socketId === socketId)
    )
};

export const serviceFactory = dispatch => {
    const boundActions = bindActionCreators(actions, dispatch);
    return Object.assign({}, boundActions);
};

const messagesInitialState = OrderedMap();

const messages = (state = messagesInitialState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHAT_INIT:
            return state.merge(payload.messages);
        case actionTypes.MESSAGE_ADD:
        case actionTypes.MESSAGE_SEND:
            return state.set(payload.timestamp, payload);
        default:
            return state;
    }
}

const usersInitialState = OrderedMap();

const users = (state = usersInitialState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHAT_INIT:
            return state.merge(fromJS(payload.users));
        case actionTypes.USER_UPDATE:
        case actionTypes.USER_ADD:
            return state.set(payload.login, fromJS(payload));
        case actionTypes.USER_UPDATE_STATUS:
            return state.update(payload.socketId, user =>
                user.remove('error').set('status', payload.status));
        default:
            return state;
    }
}

/* 
statuses are:
 connected, reconnecting, reconnect error,
 reconnect failed, disconnect, error, connect_timeout,
 connect error
*/
const connection = (state = OrderedMap(), { type, payload }) => {
    switch (type) {
        case actionTypes.CONNECTION_UPDATE:
            let { socket, status } = payload;
            state = state.set('socket', socket);
            status = status ? status : Statuses.CONNECTED;
            return state.set('status', status);
        default:
            return state;
    }
};

export default combineReducers({
    users,
    messages,
    connection
});
