import { OrderedMap } from 'immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL';

const initialState = OrderedMap();

const messageId = -1;

const ws = {
    send: () => null
};

export const sendMessage = (text) => {
    let timestamp = new Date().getTime();
    let message = {
        timestamp,
        text,
        isInc: false,
        isSent: false
    };
    return {
        type: SEND_MESSAGE,
        payload: message
    };
};

export function* sendMessageSaga({ payload }) {
    try {
        yield call(ws.send, payload);
        payload.isSent = true;
        yield put({ payload, type: SEND_MESSAGE_SUCCESS });
    }
    catch (e) {
        payload.error = e;
        yield put({ payload, type: SEND_MESSAGE_FAIL });
    }
}

export function* saga() {
    yield takeEvery(SEND_MESSAGE, sendMessageSaga);
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
