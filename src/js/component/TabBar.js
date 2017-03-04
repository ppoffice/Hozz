import React, { Component, PropTypes } from 'react';
import List from './commons/List';
import ListItem from './commons/ListItem';

export class TabBarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { name, icon } = this.props;
        return React.cloneElement(super.render(), { ...this.props }, <span className="material-icons" title={ name }>{ icon }</span>);
    }
}

TabBarItem.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
};

class TabBar extends List {
    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-primary-sidebar">
                    { super.render() }
                </div>);
    }
}

export default TabBar;