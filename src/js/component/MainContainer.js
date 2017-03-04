import React, { Component, PropTypes } from 'react';

import Section from './commons/Section';

class MainContainer extends Section {
    constructor (props) {
        super(props);
    }

    render () {
        return React.cloneElement(super.render(), { ...this.props, className: 'app-main-container' });
    }
}

export default MainContainer;