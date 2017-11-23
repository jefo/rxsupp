import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import uuid from 'uuid/v1';

import Chat from './components/chat/chat';
import connect from './connect';

if(!localStorage.getItem('cid')) {
    let id = uuid();
    localStorage.setItem('cid', id);
}
connect('http://localhost:3000');

console.log('user id', localStorage.getItem('cid'));

render(
    <Provider store={store}>
        <Chat />
    </Provider>,
    document.getElementById('root')
);
