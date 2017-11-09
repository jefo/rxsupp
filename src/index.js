import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import Chat from './components/chat/chat';
import store from './redux';

console.log(store)

render(
    <Provider store={store}>
        <Chat />
    </Provider>,
    document.getElementById('root')
);