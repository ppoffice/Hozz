import React, { Component, PropTypes } from 'react';

import List from './base/List';
import ListItem from './base/ListItem';
import SecondarySidebar from './SecondarySidebar';

export class FileSidebarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { name } = this.props;
        return React.cloneElement(super.render(), { ...this.props },
            <span className={ "app-file-item" }>{ name }</span>);
    }
}

FileSidebarItem.propTypes = {
    name: PropTypes.string.isRequired,
};

export class FileSidebarGroup extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, name, children, onClickListener } = this.props;
        return React.cloneElement(super.render(), { onClick: null },
            <div className={ "app-file-group" }>
                <span onClick={ onClickListener.bind(this, id) }>{ name }</span>
                <List onItemClickListener={ onClickListener }>{ children }</List>
            </div>);
    }
}

FileSidebarGroup.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
};

class FileSidebar extends SecondarySidebar {
    constructor (props) {
        super(props);
    }

    render () {
        return React.cloneElement(super.render(), { className: 'app-file-sidebar' });
    }
}

FileSidebar.propTypes = {
    onItemClickListener: PropTypes.func,
};

export default FileSidebar;