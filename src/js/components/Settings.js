const remote = global.require('remote');

const path = require('path');

import React, { Component } from 'react';
import JSZip from 'jszip';

import io from '../backend/io';
import log from '../backend/log';
import event from '../backend/event';
import update from '../backend/update';
import Manifest from '../backend/manifest';
import { app, dialog, ipcRenderer } from '../backend/nw.interface';
import { EVENT,
         APP_NAME,
         USER_HOME,
         APP_VERSION,
         APP_HOMEPAGE,
         APP_RELEASES_URL,
         HOSTS_COUNT_MATHER,
         SURGE_HOSTS_HEADER } from '../constants';

import Titlebar from './Titlebar';

const terminate = remote.getGlobal('terminate');
const updateStatus = remote.getGlobal('updateStatus');

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            updateStatus: updateStatus.get(),
        };
    }

    componentDidMount () {
        ipcRenderer.on('UPDATE_STATUS', (eventEmitter, value) => {
            this.setState({ updateStatus: value });
        });
    }

    __onLinkClick (index) {
        this.setState({ activeIndex: index });
    }

    __onImportZipClick () {
        const openPath = dialog.showOpenDialog({
            filters: [
                { name: 'Zip', extensions: ['zip'] },
                { name: 'All Files', extensions: ['*'] },
            ]
        });
        if (!openPath || !openPath.length) {
            return;
        }
        const confirm = dialog.showMessageBox({
            buttons: ['OK', 'Cancel'],
            type: 'warning',
            title: 'Warning',
            detail: 'Do you want to continue?',
            message: 'Your current files will be overridden.',
        });
        if (confirm === 0) {
            io.readFile(openPath[0]).then((data) => {
                const zip = new JSZip(data);
                const manifest = new Manifest(JSON.parse(zip.file('manifest.json').asText()));
                const promises = [];
                manifest.getHostsList().forEach((hosts) => {
                    hosts.setText(zip.file(hosts.uid).asText());
                    promises.push(hosts.save());
                });
                promises.push(manifest.commit());
                return Promise.all(promises);
            }).then(() => {
                dialog.showMessageBox({
                    buttons: ['OK'],
                    type: 'info',
                    title: 'Success',
                    message: 'Import Complete',
                    detail: 'Please restart ' + APP_NAME + ' for this change to take effect.',
                });
                terminate();
            }).catch((e) => {
                dialog.showErrorBox('Import Error', 'Did you open a valid file?');
                log(e);
            });
        }
    }

    __onExportZipClick () {
        const zip = new JSZip();
        Manifest.loadFromDisk().then((manifest) => {
            zip.file('manifest.json', JSON.stringify(manifest.toSimpleObject()));
            manifest.getHostsList().forEach((hosts) => {
                zip.file(hosts.uid, hosts.text);
            });
            return Promise.resolve(zip.generate({ type: 'nodebuffer' }));
        }).then((buffer) => {
            const savePath = dialog.showSaveDialog({
                defaultPath: path.join(USER_HOME, APP_NAME + '-export.zip'),
                filters: [
                    { name: 'Zip', extensions: ['zip'] },
                ]
            });
            if (savePath) {
                return io.writeFile(savePath, buffer);
            } else {
                return Promise.resolve();
            }
        }).catch(log);
    }

    __onExportSurgeClick () {
        Manifest.loadFromDisk().then((manifest) => {
            let ret;
            let text = '';
            const hosts = manifest.getMergedHosts();
            while ((ret = HOSTS_COUNT_MATHER.exec(hosts.text)) !== null) {
                if (ret.index === HOSTS_COUNT_MATHER.lastIndex) {
                    HOSTS_COUNT_MATHER.lastIndex++;
                }
                if (ret[2].indexOf('localhost') > -1 ||
                    ret[2].indexOf('broadcasthost') > -1) {
                    continue;
                }
                text += `${ ret[2] } = ${ ret[1] }\n`;
            }
            text = SURGE_HOSTS_HEADER + text;
            const savePath = dialog.showSaveDialog({
                defaultPath: path.join(USER_HOME, APP_NAME + '-surge.txt'),
                filters: [
                    { name: 'Text', extensions: ['txt'] },
                ]
            });
            if (savePath) {
                return io.writeFile(savePath, text);
            } else {
                return Promise.resolve();
            }
        }).catch(log);
    }

    __onCheckUpdateClick () {
        update(true);
    }

    __onHomepageClick () {
        event.emit(EVENT.OPEN_EXTERNAL_URL, APP_HOMEPAGE);
    }

    render() {
        const { activeIndex, updateStatus } = this.state;
        const items = [
            { name: 'import',   label: 'Import' },
            { name: 'export',   label: 'Export' },
            { name: 'language', label: 'Language' },
            { name: 'update',   label: 'Update' },
        ];
        const links = items.map((item, index) => {
            return (<li key={ index }
                        className={ activeIndex === index ? 'active' : '' }
                        onClick={ this.__onLinkClick.bind(this, index) }><a href={ '#' + item.name }>{ item.label }</a></li>);
        });
        let updateText;
        if (updateStatus === 'checking') {
            updateText = 'Checking Update';
        } else if (updateStatus === 'downloading') {
            updateText = 'Downloading Update';
        } else if (updateStatus === 'applying') {
            updateText = 'Applying Update';
        } else {
            updateText = 'Check Update';
        }
        return (<div className="settings-container">
                    <Titlebar
                        title="Settings"
                        closeAsHide={ true }
                        disableMaximize={ true } />
                    <div className="settings">
                        <ul className="links">
                            { links }
                        </ul>
                        <div className="contents">
                            <section key="import" id="import">
                                <span className="section-title">Import</span>
                                <button onClick={ this.__onImportZipClick.bind(this) }>
                                    Import from Zip
                                </button>
                            </section>
                            <section key="export" id="export">
                                <span className="section-title">Export</span>
                                <button onClick={ this.__onExportZipClick.bind(this) }>
                                    Export to Zip
                                </button>
                                <button onClick={ this.__onExportSurgeClick.bind(this) }>
                                    Export to Surge
                                </button>
                            </section>
                            <section key="language" id="language">
                                <span className="section-title">Language</span>
                                <select>
                                    <option>English</option>
                                </select>
                            </section>
                            <section key="update" id="update">
                                <span className="section-title">About</span>
                                <span className="section-title">Current Version: { APP_VERSION }</span>
                                <button onClick={ this.__onHomepageClick.bind(this) }>
                                    Homepage
                                </button>
                                <button
                                    disabled={ !!updateStatus }
                                    onClick={ this.__onCheckUpdateClick.bind(this) }>
                                    { updateText }
                                </button>
                            </section>
                        </div>
                    </div>
                </div>);
    }
}

export default Settings;
