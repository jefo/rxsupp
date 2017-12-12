import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import Immutable from 'seamless-immutable';
import { createActions, handleActions, combineActions } from 'redux-actions';

export const Actions = createActions({
    USER_UPDATE: (user) => ({ user }),
    USER_UPDATE_SUCCESS: (user) => ({ user }),
    USER_UPDATE_FAIL: undefined,
    USERS_FETCH: undefined,
    USERS_FETCH_SUCCESS: (users) => ({ users }),
    USERS_FETCH_FAIL: undefined,
    USER_REMOVE: (login) => ({ user: { login } }),
    USER_REMOVE_SUCCESS: (login) => ({ user: { login } }),
    USER_REMOVE_FAIL: undefined,
});

export const createSagas = (api) => ({
    * fetchUsers(action) {
        try {
            const resp = yield call(api.get, '/users');
            yield put(Actions.usersFetchSuccess(resp.data));
        } catch (e) {
            yield put(Actions.usersFetchFail(e));
        }
    },

    * removeUser({ payload }) {
        try {
            yield call(api.delete, '/users/' + payload.user.login);
            yield put(Actions.userRemoveSuccess(payload.user.login));
        } catch (e) {
            yield put(Actions.userRemoveFail(e));
        }
    },

    * updateUser({ payload }) {
        try {
            const res = yield call(api.put, '/users/' + payload.user.login, payload.user);
            yield put(Actions.userUpdateSuccess(res.data));
        } catch (e) {
            yield put(Actions.userUpdateFail(e));
        }
    },

    * all() {
        console.log('this', this);
        yield takeEvery(Actions.userRemove, this.removeUser);
        yield takeLatest(Actions.usersFetch, this.fetchUsers);
        yield takeLatest(Actions.userUpdate, this.updateUser);
    }
})

const initialState = Immutable({
    loading: false,
    updating: [],
    deleted: [],
    collection: {}
});

const handleFetchDone = state => state.set('loading', false);
const handleUpdateDone = state => state.update('updating', updating => updating.filter(login => login !== payload.user.login));
const handleError = (state, payload) => state.set('error', true).set('message', payload.message);

export default handleActions({
    [Actions.usersFetch]: (state, { type }) => state.set('loading', true),
    [Actions.usersFetchSuccess]: (state, { type, payload }) => handleFetchDone(state)
        .update('collection', collection => collection.merge(payload.users)),
    [Actions.usersFetchFail]: (state, { type, payload }) => handleError(handleFetchDone(state), payload),
    [Actions.userUpdate]: (state, { type, payload }) => state.update('updating', updating => [...updating, payload.user.login]),
    [Actions.userUpdateSuccess]: (state, { type, payload }) => handleUpdateDone(state)
        .updateIn(['collection', payload.user.login], user => user.merge(payload.user)),
    [Actions.userUpdateFail]: (state, { type, payload }) => handleError(handleUpdateDone(state), payload),
    [Actions.userRemove]: (state, { type, payload }) => state.update('deleted', deleted => [...deleted, payload.user.login]),
    [Actions.userRemoveFail]: (state, { type, payload }) => handleError(state, payload)
}, initialState);
