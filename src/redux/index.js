import { createStore, applyMiddleware, combineReducers } from 'redux';
import Immutable from 'immutable';
import { composeWithDevTools } from 'redux-devtools-extension';
import dynamicMiddlewares from 'redux-dynamic-middlewares';

import chat, { serviceFactory } from './chat/chat';
import logger from './logger';

const composeEnhancers = composeWithDevTools({});

const store = window.store = createStore(
    chat,
    composeEnhancers(
        applyMiddleware(dynamicMiddlewares, logger)
    )
);

export const chatService = serviceFactory(store.dispatch);

export default store;
