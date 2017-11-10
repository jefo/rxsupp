import { OrderedMap } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
console.log(Buffer)
import io from 'socket.io-client';

export const socket = io('http://localhost:3000');

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL';

const initialState = OrderedMap();

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

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SEND_MESSAGE:
        case SEND_MESSAGE_SUCCESS:
        case SEND_MESSAGE_FAIL:
            return state.set(payload.timestamp, payload);
        default:
            return state;
    }
}
