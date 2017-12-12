import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import logger from './logger';
import createChatReducer, { createChat } from '../../../rxsupp.core/src/chat';
import socket from './socket';

const composeEnhancers = composeWithDevTools({});

const store = createStore(
    createChatReducer({ socket }),
    composeEnhancers(
        applyMiddleware(logger)
    )
);

export default store;
