import { createStore, applyMiddleware } from 'redux';

import createChatReducer, { createChat } from '../../../common/src/chat';

const store = createStore(
    createChatReducer(),
);

export default store;
