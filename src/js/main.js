import React from 'react';
import ReactDOM from 'react-dom';

import update from './backend/update';
import { APP_NAME } from './constants';

import App from './components/App';

const titleDOM = document.getElementsByTagName('title')[0];
titleDOM.innerText = APP_NAME;

ReactDOM.render(<App />, document.getElementById('app'));

update.backendUpdate();