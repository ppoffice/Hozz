import React, { Component, PropTypes } from 'react';
import List from './base/List';
import ListItem from './base/ListItem';

export class PrimarySidebarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { name, icon } = this.props;
        return React.cloneElement(super.render(), { ...this.props }, <span className={ "iconfont icon-" + icon } title={ name }></span>);
    }
}

PrimarySidebarItem.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
};

class PrimarySidebar extends List {
    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-primary-sidebar">
                    { super.render() }
                </div>);
    }
}

export default PrimarySidebar;