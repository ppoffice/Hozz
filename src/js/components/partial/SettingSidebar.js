import React, { Component, PropTypes } from 'react';

import List from './base/List';
import ListItem from './base/ListItem';
import SecondarySidebar from './SecondarySidebar';

export class SettingSidebarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, name } = this.props;
        const props = { ...this.props };
        delete props.id;
        return React.cloneElement(super.render(), props,
            <a className="app-setting-item" href={ "#" + id }>{ name }</a>);
    }
}

SettingSidebarItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

class SettingSidebar extends SecondarySidebar {
    constructor (props) {
        super(props);
    }

    render () {
        return React.cloneElement(super.render(), { className: 'app-setting-sidebar' });
    }
}

export default SettingSidebar;