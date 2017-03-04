import React, { Component, PropTypes } from 'react';

import MenuItem from './MenuItem';

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