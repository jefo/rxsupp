import assert from 'assert';

import socket from '../src/redux/socket';
import { CHAT_INIT, Actions } from '../../../rxsupp.core/src/chat';

describe('socket reducer', () => {

    it('CHAT_INIT', () => {
        let action = Actions.init('123');
        let state = socket(null, action);
        assert.deepEqual(state, {
            id: '123'
        });
    });
});
