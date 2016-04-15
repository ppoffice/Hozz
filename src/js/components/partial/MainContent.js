import React, { Component, PropTypes } from 'react';

import Section from './base/Section';

class MainContent extends Section {
    constructor (props) {
        super(props);
    }

    render () {
        return React.cloneElement(super.render(), { ...this.props, className: 'app-main-content' });
    }
}

export default MainContent;