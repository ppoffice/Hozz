import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import List from './base/List';
import ListItem from './base/ListItem';
import { checkListener } from './base/Utils';

export class FileSidebarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    handleStatusClick (id) {
        const { onStatusChangeListner } = this.props;
        onStatusChangeListner && onStatusChangeListner(id);
    }

    render () {
        const { id, name, onClickListener, onEditClickListner } = this.props;
        return React.cloneElement(super.render(), { ...this.props, onClick: null },
            (<div className="app-file-item">
                <span className="status" onClick={ this.handleStatusClick.bind(this, id) }></span>
                <div className="app-file-item-center" onClick={ checkListener(onClickListener).bind(this, id) }>
                    <p className="file-name">{ name }</p>
                    <p>
                        <i className="material-icons cloud">cloud</i>
                        <span className="rule-count">2000 Rules</span>
                    </p>
                </div>
                <span className="material-icons edit" title="Edit" onClick={ checkListener(onEditClickListner).bind(this, id) }>mode_edit</span>
            </div>));
    }
}

FileSidebarItem.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    onClickListener: PropTypes.func,
    onEditClickListner: PropTypes.func,
    onStatusChangeListner: PropTypes.func,
};

export class FileSidebarGroup extends ListItem {
    constructor (props) {
        super(props);
    }

    handleStatusClick (id) {
        const { onStatusChangeListner } = this.props;
        onStatusChangeListner && onStatusChangeListner(id);
    }

    handleEditClick (id) {
        const { onEditClickListner } = this.props;
        onEditClickListner && onEditClickListner(id);
    }

    render () {
        const { id, name, collapsed, children, onClickListener, onItemEditClickListener, onItemStatusChangeListener } = this.props;
        const className = cx({
            'collapsed': collapsed,
            'app-file-group': true,
        })
        return React.cloneElement(super.render(), { onClick: null },
            <div className={ className }>
                <div className="app-file-group-title">
                    <span className="status" onClick={ this.handleStatusClick.bind(this, id) }></span>
                    <div className="app-file-group-center" onClick={ checkListener(onClickListener).bind(this, id) }>{ name }</div>
                    <span className="material-icons edit" title="Edit" onClick={ this.handleEditClick.bind(this, id) }>mode_edit</span>
                    <span className="material-icons arrow">arrow_drop_down</span>
                </div>
                <List onItemClickListener={ checkListener(onClickListener) }>{
                    React.Children.map(children, child => {
                        return React.cloneElement(child, {
                            onEditClickListner: checkListener(onItemEditClickListener).bind(this),
                            onStatusChangeListner: checkListener(onItemStatusChangeListener).bind(this)
                        });
                    })
                }</List>
            </div>);
    }
}

FileSidebarGroup.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
    onClickListener: PropTypes.func,
    onEditClickListner: PropTypes.func,
    onStatusChangeListner: PropTypes.func,
    onItemEditClickListener: PropTypes.func,
    onItemStatusChangeListener: PropTypes.func,
};

class FileSidebar extends List {
    constructor (props) {
        super(props);
    }

    render () {
        const { children, onItemClickListener, onItemEditClickListener, onItemStatusChangeListener } = this.props;
        return (<div className="app-secondary-sidebar app-file-sidebar">
                    <h2 className="app-secondary-sidebar-title">
                        <span className="app-window-draggable">Files</span>
                        <span className="material-icons add">add</span>
                    </h2>
                    <div className="app-sidebar-list-container">
                    { React.cloneElement(super.render(), {}, React.Children.map(this.props.children, child => {
                        return React.cloneElement(child, {
                            onClickListener: checkListener(onItemClickListener),
                            onEditClickListner: checkListener(onItemEditClickListener),
                            onStatusChangeListner: checkListener(onItemStatusChangeListener),
                            onItemEditClickListener: checkListener(onItemEditClickListener),
                            onItemStatusChangeListener: checkListener(onItemStatusChangeListener),
                        });
                    })) }
                    </div>
                </div>);
    }
}

FileSidebar.propTypes = {
    onItemClickListener: PropTypes.func,
    onItemEditClickListener: PropTypes.func,
    onItemStatusChangeListener: PropTypes.func,
};

export default FileSidebar;