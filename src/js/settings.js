import React from 'react';
import ReactDOM from 'react-dom';

import Lang from './backend/language';
import Manifest from './backend/manifest';

import Settings from './components/Settings';

const titleDOM = document.getElementsByTagName('title')[0];
titleDOM.innerText = 'Settings';

Manifest.loadFromDisk().then((manifest) => {
    if (manifest.language) {
        Lang.setLocale(manifest.language);
    }
    ReactDOM.render(<Settings manifest={ manifest } />, document.getElementById('app'));
});