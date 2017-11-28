import { Map } from 'immutable';

import { CHAT_INIT } from '../../../rxsupp.core/src/chat';

export default (state = Map(), { type, payload }) => {
    switch (type) {
        case CHAT_INIT:
            return state.set('id', payload.socketId);
        default: 
            return state;
    }
}
