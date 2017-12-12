import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter  } from 'react-router-dom';
import { Provider } from 'react-redux';

import Main from './components/Main/Main';
import store from './redux';

const supportsHistory = 'pushState' in window.history;

window.onload = () => {
    ReactDOM.render(
        <BrowserRouter forceRefresh={!supportsHistory}>
            <Provider store={store} >
                <Main />
            </Provider>
        </BrowserRouter>,
        document.getElementById('root'));
};
