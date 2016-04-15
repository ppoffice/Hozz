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
        return React.cloneElement(super.render(), { ...this.props },
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

SettingSidebar.propTypes = {
    onItemClickListener: PropTypes.func,
};

export default SettingSidebar;