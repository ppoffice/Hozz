import React from 'react';
import ReactDOM from 'react-dom';

import Settings from './components/Settings';

const titleDOM = document.getElementsByTagName('title')[0];
titleDOM.innerText = 'Settings';

ReactDOM.render(<Settings />, document.getElementById('app'));