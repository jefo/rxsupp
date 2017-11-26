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
    CHAT_INIT: 'CHAT_INIT',
    CHAT_READY: 'CHAT_READY',
    CHAT_SET_ROOM: 'CHAT_SET_ROOM',

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
            text
        };
        return {
            type: actionTypes.MESSAGE_SEND,
            payload: message,
            meta: { event: actionTypes.MESSAGE_SEND }
        };
    },
    addMessage: (message) => ({ type: actionTypes.MESSAGE_ADD, payload: message }),
    connectWithUser: (id) => ({ type: actionTypes.CONNECT_WITH_USER, payload: id }),
    updateUser: (user) => ({ type: actionTypes.USER_UPDATE, payload: user }),
    addUser: (user) => ({ type: actionTypes.USER_ADD, payload: user }),
    updateStatus: (status) => ({ type: actionTypes.USER_UPDATE_STATUS, payload: { socketId, status } }),
    updateConnection: (socket) => ({ type: actionTypes.CONNECTION_UPDATE, payload: { socket } }),
    updateConnectionStatus: (socket, status) => ({ type: actionTypes.CONNECTION_UPDATE, payload: { socket, status } }),
    init: (payload) => ({ type: actionTypes.CHAT_INIT, payload })
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
            return state.merge(fromJS(payload.messages));
        case actionTypes.MESSAGE_ADD:
            return state.set(payload.timestamp, fromJS(payload))
        case actionTypes.MESSAGE_SEND:
            return state.set(payload.timestamp, fromJS(payload));
        default:
            return state;
    }
}

const usersInitialState = OrderedMap();

/* 
statuses are:
 connected, reconnecting, reconnect error,
 reconnect failed, disconnect, error, connect_timeout,
 connect error
*/
const users = (state = usersInitialState, { type, payload }) => {
    switch (type) {
        case actionTypes.CHAT_INIT:
            return state.merge(fromJS(payload.users));
        case actionTypes.USER_UPDATE:
            let key = payload.login ? payload.login : payload.socketId;
            return state.update(key, user => user.merge(payload));
        case actionTypes.USER_ADD:
            return state.set(payload.login, fromJS(payload));
        case actionTypes.USER_UPDATE_STATUS:
            return state.update(payload.socketId, user =>
                user.remove('error').set('status', payload.status));
        default:
            return state;
    }
}

const connection = (state = OrderedMap(), { type, payload }) => {
    switch (type) {
        case actionTypes.CHAT_INIT:
            return state.set('socketId', payload.socketId);
        default:
            return state;
    }
};

export default combineReducers({
    users,
    messages,
    connection
});
