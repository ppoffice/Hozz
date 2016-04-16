import React, { Component, PropTypes } from 'react';

import List from './base/List';
import ListItem from './base/ListItem';
import { checkListener } from './base/Utils';
import SecondarySidebar from './SecondarySidebar';

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
                <span className="status" onClick={ this.handleStatusClick.bind(this, id) }>O</span>
                <div className="app-file-item-center" onClick={ checkListener(onClickListener).bind(this, id) }>
                    <p className="file-name">{ name }</p>
                    <p>
                        <i className="iconfont icon-cloud"></i>
                        <span className="rule-count">{ 2000 }</span>
                    </p>
                </div>
                <span className="iconfont icon-edit" onClick={ checkListener(onEditClickListner).bind(this, id) }></span>
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
        const { id, name, children, onClickListener, onItemEditClickListener, onItemStatusChangeListener } = this.props;
        return React.cloneElement(super.render(), { onClick: null },
            <div className={ "app-file-group" }>
                <div className="app-file-group-title">
                    <span className="status" onClick={ this.handleStatusClick.bind(this, id) }>O</span>
                    <span onClick={ checkListener(onClickListener).bind(this, id) }>{ name }</span>
                    <span className="iconfont icon-edit" onClick={ this.handleEditClick.bind(this, id) }></span>
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
    onClickListener: PropTypes.func,
    onEditClickListner: PropTypes.func,
    onStatusChangeListner: PropTypes.func,
    onItemEditClickListener: PropTypes.func,
    onItemStatusChangeListener: PropTypes.func,
};

class FileSidebar extends SecondarySidebar {
    constructor (props) {
        super(props);
    }

    render () {
        const { children, onItemClickListener, onItemEditClickListener, onItemStatusChangeListener } = this.props;
        return React.cloneElement(super.render(), { className: 'app-file-sidebar' }, React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                onClickListener: checkListener(onItemClickListener),
                onEditClickListner: checkListener(onItemEditClickListener),
                onStatusChangeListner: checkListener(onItemStatusChangeListener),
                onItemEditClickListener: checkListener(onItemEditClickListener),
                onItemStatusChangeListener: checkListener(onItemStatusChangeListener),
            });
        }));
    }
}

FileSidebar.propTypes = {
    onItemClickListener: PropTypes.func,
    onItemEditClickListener: PropTypes.func,
    onItemStatusChangeListener: PropTypes.func,
};

export default FileSidebar;