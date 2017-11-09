import { OrderedSet } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL';

const initialState = OrderedMap();

const messageId = -1;

const ws = {
    send: () => null
};

const sendMessage = (text) => {
    let timestamp = new Date().getTime();
    let message = {
        text,
        timestamp,
        isInc: false,
        isSent: false
    };
    try {
        ws.send(message);
        message.isSent = true;
        yield put({ type: SEND_MESSAGE_SUCCESS, message });
    }
    catch (e) {
        message.error = e;
        yield put({ type: SEND_MESSAGE_FAIL, message });
    }
};

export function* saga() {
    yield takeLatest(SEND_MESSAGE, sendMessage);
}

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
