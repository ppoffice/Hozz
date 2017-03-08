import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import List from './commons/List';
import ListItem from './commons/ListItem';
import { checkListener } from '../utils/Utils';

export class FilesSidebarItem extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, name, status, onClickListener, onEditClickListener, onStatusChangeListener } = this.props;
        return React.cloneElement(super.render(), { ...this.props, onClick: null },
            (<div className="app-file-item">
                <span className={ `status ${ status }` } onClick={ checkListener(onStatusChangeListener).bind(this, id) }/>
                <div className="app-file-item-center" onClick={ checkListener(onClickListener).bind(this, id) }>
                    <p className="file-name">{ name }</p>
                    <p>
                        <i className="material-icons cloud">cloud</i>
                        <span className="rule-count">2000 Rules</span>
                    </p>
                </div>
                <span className="material-icons edit" title="Edit" onClick={ checkListener(onEditClickListener).bind(this, id) }>mode_edit</span>
            </div>));
    }
}

FilesSidebarItem.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onClickListener: PropTypes.func,
    onEditClickListener: PropTypes.func,
    onStatusChangeListener: PropTypes.func,
};

export class FilesSidebarGroup extends ListItem {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, name, status, collapsed, children, onClickListener, onStatusChangeListener, onEditClickListener, onItemEditClickListener, onItemStatusChangeListener } = this.props;
        const className = cx({
            'collapsed': collapsed,
            'app-file-group': true,
        });
        return React.cloneElement(super.render(), { onClick: null },
            <div className={ className }>
                <div className="app-file-group-title">
                    <span className={ `status ${ status }` } onClick={ checkListener(onStatusChangeListener).bind(null, id) }/>
                    <div className="app-file-group-center" onClick={ checkListener(onClickListener).bind(null, id) }>{ name }</div>
                    <span className="material-icons edit" title="Edit" onClick={ checkListener(onEditClickListener).bind(null, id) }>mode_edit</span>
                    <span className="material-icons arrow" onClick={ checkListener(onClickListener).bind(null, id) }>arrow_drop_down</span>
                </div>
                <List onItemClickListener={ checkListener(onClickListener) }>{
                    React.Children.map(children, child => {
                        return React.cloneElement(child, {
                            onEditClickListener: checkListener(onItemEditClickListener).bind(this),
                            onStatusChangeListener: checkListener(onItemStatusChangeListener).bind(this)
                        });
                    })
                }</List>
            </div>);
    }
}

FilesSidebarGroup.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
    onClickListener: PropTypes.func,
    onEditClickListener: PropTypes.func,
    onStatusChangeListener: PropTypes.func,
    onItemEditClickListener: PropTypes.func,
    onItemStatusChangeListener: PropTypes.func,
};

class FilesSidebar extends List {
    constructor (props) {
        super(props);
    }

    render () {
        const { children, onItemClickListener, onItemEditClickListener, onItemStatusChangeListener } = this.props;
        return (<div className="app-secondary-sidebar app-files-sidebar">
                    <h2 className="app-secondary-sidebar-title">
                        <span className="app-window-draggable">Files</span>
                        <span className="material-icons add">add</span>
                    </h2>
                    <div className="app-sidebar-list-container">
                    { React.cloneElement(super.render(), {}, React.Children.map(this.props.children, child => {
                        return React.cloneElement(child, {
                            onClickListener: checkListener(onItemClickListener),
                            onEditClickListener: checkListener(onItemEditClickListener),
                            onStatusChangeListener: checkListener(onItemStatusChangeListener),
                            onItemEditClickListener: checkListener(onItemEditClickListener),
                            onItemStatusChangeListener: checkListener(onItemStatusChangeListener),
                        });
                    })) }
                    </div>
                </div>);
    }
}

FilesSidebar.propTypes = {
    onItemClickListener: PropTypes.func,
    onItemEditClickListener: PropTypes.func,
    onItemStatusChangeListener: PropTypes.func,
};

export default FilesSidebar;