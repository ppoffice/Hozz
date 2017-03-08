import React from 'react';
import ReactDOM from 'react-dom';

import { APP_NAME } from './config';
import App from './components/App';

/**
 * Set main window title
 */
document.getElementsByTagName('title')[0].innerText = APP_NAME;

ReactDOM.render(<App />, document.getElementById('app-container'));