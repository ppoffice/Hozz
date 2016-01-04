import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import dragula from 'react-dragula';

import { EVENT,
         APP_NAME,
         TOTAL_HOSTS_UID,
         NO_PERM_ERROR_TAG,
         NO_PERM_ERROR_TAG_WIN32 } from '../constants';
import codemirrorOptions from '../codemirror.config.js';

import io from '../backend/io';
import event from '../backend/event';
import Hosts from '../backend/hosts';
import nw from '../backend/nw.interface';
import Manifest from '../backend/manifest';
import permission from '../backend/permission';

import Editor from './Editor';
import Sidebar from './Sidebar';
import Titlebar from './Titlebar';
import SnackBar from './SnackBar';

const getPosition = (element) => {
    return Array.prototype.slice.call(element.parentElement.children).indexOf(element);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.totalHosts = null;
        this.dragStartPosition = -1;
        this.state = {
            snack: null,
            manifest: null,
            activeUid: null,
            editingUid: null,
            searchText: '',
        }
    }

    componentDidMount () {
        Manifest.loadFromDisk().then((manifest) => {
            const updateRemoteHosts = manifest.getHostsList().map((hosts) => {
                return hosts.updateFromUrl().then(() => {
                    this.__updateManifest(manifest);
                });
            });
            this.__updateManifest(manifest);
            Promise.all(updateRemoteHosts).then(() => {
                event.emit(EVENT.INITIAL_CLOUD_HOSTS_UPDATED);
            });
        });
        const drake = dragula([document.querySelector('.sidebar-list-dragable')]);
        drake.on('drag', (element) => {
            this.dragStartPosition = getPosition(element);
        });
        drake.on('drop', (element) => {
            const { manifest } = this.state;
            if (manifest && this.dragStartPosition > -1) {
                manifest.moveHostsIndex(this.dragStartPosition, getPosition(element));
                manifest.commit();
            }
            drake.cancel(true);
            this.__updateManifest(manifest, false);
        });
        drake.on('cancel', (element) => {
            this.dragStartPosition = -1;
        });
    }

    __updateManifest (manifest) {
        this.totalHosts = manifest.getMergedHosts();
        manifest.saveSysHosts(this.totalHosts).catch((error) => {
            if (error.message.indexOf(NO_PERM_ERROR_TAG) > -1 ||
                error.message.indexOf(NO_PERM_ERROR_TAG_WIN32) > -1) {
                this.__onPermissionError();
            }
        });
        this.__createHostsTrayMenu(manifest);
        this.setState({ manifest });
    }

    __createHostsTrayMenu (manifest) {
        const menus = [];
        menus.push({
            label: this.totalHosts.name,
            type: 'checkbox',
            checked: this.totalHosts.online,
            click: () => {
                manifest.online = !manifest.online;
                manifest.commit();
                this.__updateManifest(manifest);
            }
        });
        for (let hosts of manifest.getHostsList()) {
            menus.push({
                label: hosts.name,
                type: 'checkbox',
                checked: hosts.online,
                click: () => {
                    if (manifest.online) {
                        hosts.toggleStatus();
                        manifest.commit();
                    }
                    this.__updateManifest(manifest);
                }
            });
        }
        event.emit(EVENT.SET_HOSTS_MENU, menus);
    }

    __updateHosts (uid, text) {
        const { manifest } = this.state;
        const hosts = manifest.getHostsByUid(uid);
        if (uid !== TOTAL_HOSTS_UID && hosts) {
            hosts.setText(text);
            hosts.save();
            manifest.commit();
            this.__updateManifest(manifest);
        }
    }

    __onHostsClick (item) {
        this.setState({ activeUid: item.uid });
    }

    __onHostsRemove (item) {
        const { manifest } = this.state;
        manifest.removeHosts(item).commit();
        item.remove().then(() => {
            this.__updateManifest(manifest);
        });
    }

    __onHostsStatusChange (item) {
        const { manifest } = this.state;
        if (item.uid !== TOTAL_HOSTS_UID) {
            if (manifest.online) {
                manifest.getHostsByUid(item.uid).toggleStatus();
                manifest.commit();
                this.__updateManifest(manifest);
            }
        } else {
            manifest.online = !manifest.online;
            manifest.commit();
            this.__updateManifest(manifest);
        }
    }

    __createNewHosts (options) {
        const { manifest } = this.state;
        if (options && options.name) {
            const hosts = new Hosts(options);
            if (hosts.url) {
                hosts.updateFromUrl().then(() => {
                    this.__updateManifest(manifest);
                });
            } else {
                hosts.save();
            }
            manifest.addHosts(hosts).commit();
            this.__updateManifest(manifest);
        }
    }

    __onUpdateHostsClick (nextHosts) {
        const { manifest } = this.state;
        if (nextHosts && nextHosts.name) {
            if (nextHosts.url) {
                nextHosts.updateFromUrl().then(() => {
                    this.__updateManifest(manifest);
                });
            } else {
                nextHosts.save();
            }
            manifest.setHostsByUid(nextHosts.uid, nextHosts);
            manifest.commit();
            this.__updateManifest(manifest);
        }
        this.setState({ editingUid: null });
    }

    __onHostsEdit (hosts) {
        this.setState({ editingUid: hosts.uid });
    }

    __onSearchChange (text) {
        this.setState({ searchText: text });
    }

    __onSnackDismiss () {
        this.setState({ snack: null });
    }

    __onPermissionError () {
        this.setState({
            snack: {
                type: 'danger',
                text: 'You don\'t have the permission to write to hosts file.',
                actions: [
                    {
                        name: 'Grant Permission',
                        onClick: () => {
                            permission.enableFullAccess();
                            this.__onSnackDismiss();
                        }
                    },
                ]
            }
        });
    }

    __onDrop (files) {
        const promises = io.readDropFiles(files);
        for (let promise of promises) {
            promise.then((result) => {
                this.__createNewHosts(result);
            });
        }
    }

    render() {
        const { snack, manifest, activeUid, editingUid, searchText } = this.state;
        let list = manifest ? manifest.getHostsList() : [];
        if (searchText) {
            list = list.filter((hosts) => {
                return hosts.name.indexOf(searchText) > -1 || hosts.text.indexOf(searchText) > -1;
            });
        }
        let activeHosts = null;
        if (activeUid !== null) {
            if (activeUid !== TOTAL_HOSTS_UID) {
                activeHosts = manifest.getHostsByUid(activeUid);
            } else {
                activeHosts = this.totalHosts;
            }
        }
        let editingHosts = null;
        if (editingUid !== null) {
            editingHosts = manifest.getHostsByUid(editingUid);
        }
        let cmOptions = codemirrorOptions;
        if (activeHosts && (TOTAL_HOSTS_UID === activeHosts.uid || activeHosts.url)) {
            cmOptions = Object.assign({}, cmOptions, { readOnly: true });
        } else {
            cmOptions = Object.assign({}, cmOptions, { readOnly: false });
        }
        return (<div>
                    <Dropzone
                        className="dropzone"
                        disableClick={ true }
                        activeClassName="dropzone-active"
                        onDrop={ this.__onDrop.bind(this) } >
                        <div>
                            <Sidebar
                                list={ list }
                                activeUid={ activeUid }
                                totalHosts={ this.totalHosts }
                                editingHosts={ editingHosts }
                                onItemEdit={ this.__onHostsEdit.bind(this) }
                                onItemClick={ this.__onHostsClick.bind(this) }
                                onItemRemove={ this.__onHostsRemove.bind(this) }
                                onSearchChange={ this.__onSearchChange.bind(this) }
                                onAddHostsClick={ this.__createNewHosts.bind(this) }
                                onUpdateHostsClick={ this.__onUpdateHostsClick.bind(this) }
                                onItemStatusChange={ this.__onHostsStatusChange.bind(this) } />
                        </div>
                    </Dropzone>
                    <div className="main-container">
                        <Titlebar
                            closeAsHide={ true }
                            title={ activeHosts ? activeHosts.name : APP_NAME } />
                        { snack !== null ?
                            <SnackBar
                                type={ snack.type }
                                text={ snack.text }
                                actions={ snack.actions }
                                onDismiss={ this.__onSnackDismiss.bind(this) } /> :
                            null }
                        { activeHosts ?
                            <Editor
                                uid={ activeUid }
                                key={ activeUid }
                                options={ cmOptions }
                                value={ activeHosts.text }
                                onTextShouldUpdate={ this.__updateHosts.bind(this) } /> : null }
                    </div>
                </div>);
    }
}

export default App;
