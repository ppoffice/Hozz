import React, { Component, PropTypes } from 'react';
import List from './base/List';

class SecondarySidebar extends List {
    constructor (props) {
        super(props);
    }

    render () {
        const { className } = this.props;
        return (<div className={ "app-secondary-sidebar" + (className ? " " + className : "")}>
                    { super.render() }
                </div>);
    }
}

export default SecondarySidebar;