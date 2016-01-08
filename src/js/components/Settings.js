const remote = global.require('remote');

const path = require('path');

import React, { Component } from 'react';
import JSZip from 'jszip';
import Select from 'react-select';

import io from '../backend/io';
import log from '../backend/log';
import event from '../backend/event';
import Lang from '../backend/language';
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
            locale: Lang.getCurrentLocale(),
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
                { name: Lang.get('common.all_files'), extensions: ['*'] },
            ]
        });
        if (!openPath || !openPath.length) {
            return;
        }
        const confirm = dialog.showMessageBox({
            buttons: ['OK', 'Cancel'],
            type: 'warning',
            title: Lang.get('common.warning'),
            detail: Lang.get('settings.confirm_continue'),
            message: Lang.get('settings.overridden_warning'),
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
                    title: Lang.get('common.success'),
                    message: Lang.get('settings.import_complete'),
                    detail: Lang.get('settings.please_restart_app', APP_NAME),
                });
                terminate();
            }).catch((e) => {
                dialog.showErrorBox(
                    Lang.get('settings.import_error'),
                    Lang.get('settings.confirm_a_valid_file')
                );
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
                    { name: Lang.get('common.text'), extensions: ['txt'] },
                ]
            });
            if (savePath) {
                return io.writeFile(savePath, text);
            } else {
                return Promise.resolve();
            }
        }).catch(log);
    }

    __onLanguageChange (lang) {
        const currentLocale = Lang.getCurrentLocale();
        this.setState({ locale: lang });
        if (lang.value !== currentLocale.value) {
            Manifest.loadFromDisk().then((manifest) => {
                manifest.language = lang.value;
                return manifest.commit();
            }).then(() => {
                dialog.showMessageBox({
                    buttons: ['OK'],
                    type: 'info',
                    title: Lang.get('common.success'),
                    message: Lang.get('settings.language_changed'),
                    detail: Lang.get('settings.please_restart_app', APP_NAME),
                });
                terminate();
            });
        }
    }

    __onCheckUpdateClick () {
        update(true);
    }

    __onHomepageClick () {
        event.emit(EVENT.OPEN_EXTERNAL_URL, APP_HOMEPAGE);
    }

    render() {
        const { activeIndex, updateStatus, locale } = this.state;
        const items = [
            { name: 'import',   label: Lang.get('settings.import') },
            { name: 'export',   label: Lang.get('settings.export') },
            { name: 'language', label: Lang.get('settings.language') },
            { name: 'about',    label: Lang.get('settings.about') },
        ];
        const links = items.map((item, index) => {
            return (<li key={ index }
                        className={ activeIndex === index ? 'active' : '' }
                        onClick={ this.__onLinkClick.bind(this, index) }><a href={ '#' + item.name }>{ item.label }</a></li>);
        });
        let updateText;
        if (updateStatus === 'checking') {
            updateText = Lang.get('settings.checking_update');
        } else if (updateStatus === 'downloading') {
            updateText = Lang.get('settings.downloading_update');
        } else if (updateStatus === 'applying') {
            updateText = Lang.get('settings.applying_update');
        } else {
            updateText = Lang.get('settings.check_update');
        }
        return (<div className="settings-container">
                    <Titlebar
                        closeAsHide={ true }
                        disableMaximize={ true }
                        title={ Lang.get('common.settings') } />
                    <div className="settings">
                        <ul className="links">
                            { links }
                        </ul>
                        <div className="contents">
                            <section key="import" id="import">
                                <span className="section-title">{ Lang.get('settings.import') }</span>
                                <button onClick={ this.__onImportZipClick.bind(this) }>
                                    { Lang.get('settings.import_from_zip') }
                                </button>
                            </section>
                            <section key="export" id="export">
                                <span className="section-title">{ Lang.get('settings.export') }</span>
                                <button onClick={ this.__onExportZipClick.bind(this) }>
                                    { Lang.get('settings.export_to_zip') }
                                </button>
                                <button onClick={ this.__onExportSurgeClick.bind(this) }>
                                    { Lang.get('settings.export_to_surge') }
                                </button>
                            </section>
                            <section key="language" id="language">
                                <span className="section-title">{ Lang.get('settings.language') }</span>
                                <Select
                                    clearable={ false }
                                    searchable={ false }
                                    className="language-select"
                                    name={ locale.label }
                                    value={ locale.value }
                                    options={ Lang.getLocales() }
                                    onChange={ this.__onLanguageChange.bind(this) } />
                            </section>
                            <section key="about" id="about">
                                <span className="section-title">{ Lang.get('settings.about') }</span>
                                <span className="section-title">{ Lang.get('settings.current_version', APP_VERSION) }</span>
                                <button onClick={ this.__onHomepageClick.bind(this) }>
                                    { Lang.get('settings.homepage') }
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
