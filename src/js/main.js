import React from 'react';
import ReactDOM from 'react-dom';

import update from './backend/update';
import Lang from './backend/language';
import Manifest from './backend/manifest';
import { APP_NAME } from './constants';

import App from './components/App';

const titleDOM = document.getElementsByTagName('title')[0];
titleDOM.innerText = APP_NAME;

Manifest.loadFromDisk().then((manifest) => {
    if (manifest.language) {
        Lang.setLocale(manifest.language);
    }
    ReactDOM.render(<App />, document.getElementById('app'));
});

update(false);