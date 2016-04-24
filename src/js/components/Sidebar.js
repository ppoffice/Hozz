import React, { Component, PropTypes } from 'react';

import event from '../backend/event';
import { EVENT, TOTAL_HOSTS_UID } from '../constants';

import SearchBox from './SearchBox';
import SidebarItem from './SidebarItem';
import HostsInfoDialog from './HostsInfoDialog';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddingHosts: false,
            isEditingHosts: false,
            nextHosts: { name: '', url: '' },
        }
    }

    componentWillReceiveProps (nextProps) {
        const { editingHosts } = nextProps;
        const { isAddingHosts, isEditingHosts } = this.state;
        if (!isAddingHosts && !isEditingHosts && nextProps.editingHosts) {
            this.setState({
                isEditingHosts: true,
                nextHosts: {
                    url: editingHosts.url,
                    name: editingHosts.name,
                },
            });
        }
    }

    __onItemClick (item) {
        const { onItemClick } = this.props;
        onItemClick && onItemClick(item);
    }

    __onHostsDialogOKClick () {
        const { isAddingHosts, isEditingHosts, nextHosts } = this.state;
        const { editingHosts, onAddHostsClick, onUpdateHostsClick } = this.props;
        if (isAddingHosts && onAddHostsClick) {
            onAddHostsClick(nextHosts);
        } else if (isEditingHosts && onUpdateHostsClick) {
            editingHosts.url = nextHosts.url.trim();
            editingHosts.name = nextHosts.name.trim();
            onUpdateHostsClick(editingHosts);
        }
        this.setState({
            isAddingHosts: false,
            isEditingHosts: false,
            nextHosts: { url: '', name: '' }
        });
    }

    __onHostsDialogAddClick () {
        this.setState({
            isAddingHosts: true,
            nextHosts: { url: '', name: '' },
        });
    }

    __onDialogInputChange (name, url) {
        this.setState({ nextHosts: { name, url } });
    }

    __onDialogDismiss () {
        const { isAddingHosts, isEditingHosts, nextHosts } = this.state;
        const { editingHosts, onAddHostsClick, onUpdateHostsClick } = this.props;
        if (isAddingHosts && onAddHostsClick) {
            onAddHostsClick(null);
        } else if (isEditingHosts && onUpdateHostsClick) {
            onUpdateHostsClick(null);
        }
        this.setState({
            isAddingHosts: false,
            isEditingHosts: false,
            nextHosts: { url: '', name: '' }
        });
    }

    __onSettingsClick () {
        event.emit(EVENT.OPEN_SETTINGS_WINDOW);
    }

    __renderSidebarItem (item) {
        const { activeUid, onItemEdit, onItemRemove, onItemStatusChange } = this.props;
        if (!item) {
            return null;
        }
        return (<SidebarItem
                    item={ item }
                    key={ item.uid }
                    active={ activeUid === item.uid }
                    onClick={ this.__onItemClick.bind(this, item) }
                    onStatusChange={ onItemStatusChange.bind(null, item) }
                    onEdit={ item.uid !== TOTAL_HOSTS_UID ? onItemEdit.bind(null, item) : null }
                    onRemove={ item.uid !== TOTAL_HOSTS_UID ? onItemRemove.bind(null, item) : null } />)
    }

    render() {
        const { isAddingHosts, isEditingHosts } = this.state;
        const { list, totalHosts, editingHosts, onSearchChange } = this.props;
        const sidebarItems = list.map((item, index) => {
            return this.__renderSidebarItem(item);
        });
        const addHostsButton = isAddingHosts || isEditingHosts ?
                                <i className="iconfont ok" onClick={ this.__onHostsDialogOKClick.bind(this) }>&#xe60a;</i> :
                                <i className="iconfont add" onClick={ this.__onHostsDialogAddClick.bind(this) }>&#xe600;</i>;
        return (<div className="sidebar">
                    <SearchBox className="sidebar-search" onTextChange={ onSearchChange } />
                    <div className="sidebar-list">
                        { this.__renderSidebarItem(totalHosts) }
                        <div className="sidebar-list-dragable">
                            { sidebarItems }
                        </div>
                    </div>
                    <div className="sidebar-bottom">
                        <div className="actions">
                            { addHostsButton }
                            <i className="iconfont settings" onClick={ this.__onSettingsClick.bind(this) }>&#xe605;</i>
                        </div>
                    </div>
                    { isAddingHosts || isEditingHosts ?
                        <HostsInfoDialog
                            url={ editingHosts ? editingHosts.url : '' }
                            name={ editingHosts ? editingHosts.name : '' }
                            onDismiss={ this.__onDialogDismiss.bind(this) }
                            onHostDialogOK={ this.__onHostsDialogOKClick.bind(this) }
                            onInputChange={ this.__onDialogInputChange.bind(this) } /> : null }
                </div>);
    }
}

Sidebar.propTypes = {
    list: PropTypes.array,
    onItemEdit: PropTypes.func,
    onItemClick: PropTypes.func,
    activeUid: PropTypes.string,
    onItemRemove: PropTypes.func,
    totalHosts: PropTypes.object,
    editingHosts: PropTypes.object,
    onSearchChange: PropTypes.func,
    onAddHostsClick: PropTypes.func,
    onUpdateHostsClick: PropTypes.func,
    onItemStatusChange: PropTypes.func,
};

export default Sidebar;
