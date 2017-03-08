import React, { Component, PropTypes } from 'react';

import List from './commons/List';
import ListItem from './commons/ListItem';

export class SettingsSidebarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, icon, name } = this.props;
        const props = { ...this.props };
        delete props.id;
        return React.cloneElement(super.render(), props,
            <a className="app-setting-item" href={ "#" + id }><i className="material-icons">{ icon }</i>{ name }</a>);
    }
}

SettingsSidebarItem.propTypes = {
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

class SettingsSidebar extends List {
    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-secondary-sidebar app-setting-sidebar">
                    <h2 className="app-secondary-sidebar-title app-window-draggable">Settings</h2>
                    <div className="app-sidebar-list-container">
                    { super.render() }
                    </div>
                </div>);
    }
}

export default SettingsSidebar;