import React, { Component, PropTypes } from 'react';

import MenuItem from './MenuItem';
import Electron from '../../../service/ElectronService';

class MenuSeparator extends MenuItem {
    constructor (props) {
        super(props);
    }

    _render () {
        this.props = { type: 'separator' };
        return super._render();
    }
}

export default MenuSeparator;