import { createStore, applyMiddleware } from 'redux';

import createChatReducer, { createChat } from '../../rxsupp.core/src/chat';

const store = createStore(
    createChatReducer(),
);

export default store;
