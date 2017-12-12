import assert from 'assert';
import Immutable from 'seamless-immutable';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import usersReducer, {
    Actions,
    createSagas,
    api
} from '../src/redux/users';

describe('users', () => {
    describe('actions', () => {
        it('userUpdate', () => {
            assert.deepEqual(Actions.userUpdate({ login: 'John', firstName: 'John' }), {
                type: 'USER_UPDATE',
                payload: { user: { login: 'John', firstName: 'John' } }
            });
        });
        it('userUpdateSuccess', () => {
            assert.deepEqual(Actions.userUpdateSuccess({ firstName: 'John' }), {
                type: 'USER_UPDATE_SUCCESS',
                payload: { user: { firstName: 'John' } }
            });
        });
        it('userUpdateFail', () => {
            assert.deepEqual(Actions.userUpdateFail(new Error('update fail')), {
                type: 'USER_UPDATE_FAIL',
                error: true,
                payload: new Error('update fail')
            });
        });
        it('usersFetch', () => {
            assert.deepEqual(Actions.usersFetch(), {
                type: 'USERS_FETCH'
            });
        });
        it('usersFetchSuccess', () => {
            assert.deepEqual(Actions.usersFetchSuccess([
                { firstName: 'John' },
                { firstName: 'Martin' },
            ]), {
                    type: 'USERS_FETCH_SUCCESS',
                    payload: {
                        users: [
                            { firstName: 'John' },
                            { firstName: 'Martin' },
                        ]
                    }
                });
        });
        it('usersFetchFail', () => {
            assert.deepEqual(Actions.usersFetchFail(new Error('fetch fail')), {
                type: 'USERS_FETCH_FAIL',
                error: true,
                payload: new Error('fetch fail')
            });
        });
        it('userRemove', () => {
            assert.deepEqual(Actions.userRemove('John'), {
                type: 'USER_REMOVE',
                payload: { user: { login: 'John' } }
            });
        });
        it('userRemoveSuccess', () => {
            assert.deepEqual(Actions.userRemoveSuccess('John'), {
                type: 'USER_REMOVE_SUCCESS',
                payload: { user: { login: 'John' } }
            });
        });
        it('userRemoveFail', () => {
            assert.deepEqual(Actions.userRemoveFail(new Error('remove fail')), {
                type: 'USER_REMOVE_FAIL',
                error: true,
                payload: new Error('remove fail')
            });
        });
    });
    describe('saga', () => {
        let sagas;
        let respData;
        let api;

        beforeAll(() => {
            respData = {
                'joe': { login: 'joe' },
                'pit': { login: 'pit' }
            };
            api = {
                get: () => respData,
                put: (user) => user,
                delete: (login) => login
            };
            sagas = createSagas(api);
        });
        it('fetchUsers', () => {
            const gen = sagas.fetchUsers();
            assert.deepEqual(
                gen.next().value,
                call(api.get, '/users')
            );
            const res = {
                data: {
                    'joe': { login: 'joe' },
                    'pit': { login: 'pit' }
                }
            };
            let expected = gen.next(res).value;
            let actual = put(Actions.usersFetchSuccess(res.data))
            assert.deepEqual(actual.PUT.action.payload, expected.PUT.action.payload);
            assert.deepEqual(
                expected,
                actual
            );
        });
        it('removeUser', () => {
            const gen = sagas.removeUser(Actions.userRemove('joe'));
            assert.deepEqual(
                gen.next().value,
                call(api.delete, '/users/joe')
            );
            let expected = gen.next().value;
            let actual = put(Actions.userRemoveSuccess('joe'))
            assert.deepEqual(actual.PUT.action.payload, expected.PUT.action.payload);
            assert.deepEqual(
                expected,
                actual
            );
        });
        it('updateUser', () => {
            const payload = { login: 'joe', firstName: 'Joe' };
            const gen = sagas.updateUser(Actions.userUpdate(payload));
            assert.deepEqual(
                gen.next().value,
                call(api.put, '/users/joe', payload)
            );
            const res = {
                data: payload
            };
            let expected = gen.next(res).value;
            let actual = put(Actions.userUpdateSuccess(res.data))
            assert.deepEqual(actual.PUT.action.payload, expected.PUT.action.payload);
            assert.deepEqual(
                expected,
                actual
            );
        });
    });

    describe('reducer', () => {

        let initialState;

        beforeEach(() => {
            initialState = Immutable({
                loading: false,
                updating: [],
                deleted: [],
                collection: {
                    'joe': { login: 'joe' }
                }
            });
        });

        // fetch
        it('usersFetch', () => {
            const act = Actions.usersFetch();
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                loading: true
            }));
        });
        it('usersFetchSuccess', () => {
            const act = Actions.usersFetchSuccess({
                'travor': { login: 'travor' },
                'pit': { login: 'pit' }
            });
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                loading: false,
                collection: {
                    'joe': { login: 'joe' },
                    'travor': { login: 'travor' },
                    'pit': { login: 'pit' }
                }
            }));
        });
        it('userFetchFail', () => {
            const act = Actions.usersFetchFail(new Error('fetch failed'));
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                loading: false,
                error: true,
                message: 'fetch failed'
            }));
        });

        // update
        it('userUpdate', () => {
            const act = Actions.userUpdate({ login: 'joe', firstName: 'Joe' });
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                updating: ['joe']
            }));
        });
        it('userUpdateSuccess', () => {
            const act = Actions.userUpdateSuccess({ login: 'joe', firstName: 'Joe' });
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                updating: [],
                collection: {
                    'joe': { login: 'joe', firstName: 'Joe' }
                }
            }));
        });
        it('userUpdateFail', () => {
            const act = Actions.userUpdateFail(new Error('update failed'));
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                error: true,
                message: 'update failed'
            }));
        });

        // remove
        it('userRemove', () => {
            const act = Actions.userRemove('joe');
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                deleted: ['joe']
            }));
        });
        it('userRemoveFail', () => {
            const act = Actions.userRemoveFail(new Error('remove failed'));
            const state = usersReducer(initialState, act);
            assert.deepEqual(state, initialState.merge({
                deleted: [],
                error: true,
                message: 'remove failed'
            }));
        });
    });
});
