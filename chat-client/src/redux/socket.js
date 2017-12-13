import { Map } from 'immutable';

import { CHAT_INIT } from '../../../common/src/chat';

export default (state = Map(), { type, payload }) => {
    switch (type) {
        case CHAT_INIT:
            return state
            .set('id', payload.socketId)
            .set('userId', payload.userId);
        default: 
            return state;
    }
}
