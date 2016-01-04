const remote = global.require('remote');

const path = require('path');
const mkdirp = require('mkdirp');

import JSZip from 'jszip';

import io from '../backend/io';
import log from '../backend/log';
import { app, dialog } from '../backend/nw.interface';
import { APP_NAME,
         APP_VERSION,
         APP_HOMEPAGE,
         APP_RELEASES_URL } from '../constants';

const terminate = remote.getGlobal('terminate');
const updateStatus = remote.getGlobal('updateStatus');

const isNewVersion = (v1, v2) => {
    if (v1 != v2) {
        let v1slices = v1.split('.');
        let v2slices = v2.split('.');
        let length = Math.min(v1slices.length, v2slices.length);
        for (let i = 0; i < length; i++) {
            let v1clip = parseInt(v1slices[i]);
            let v2clip = parseInt(v2slices[i]);
            if (isNaN(v2clip) || v1clip > v2clip) {
                return false;
            } else if (v1clip < v2clip) {
                return true;
            }
        }
    }
    return false;
}

const checkUpdate = (showNoUpdateFoundDialog = true) => {
    updateStatus.set('checking');
    return io.requestUrl(APP_RELEASES_URL).then((json) => {
        const releases = JSON.parse(json).sort((A, B) => B.id - A.id);
        const latestRelease = releases[0];
        if (!latestRelease || !latestRelease.tag_name) {
            return Promise.reject(new Error('Cannot find valid latest release'));
        }
        const latestVersion = latestRelease.tag_name[0] === 'v' ?
                              latestRelease.tag_name.slice(1) :
                              latestRelease.tag_name;
        if (isNewVersion(APP_VERSION, latestVersion)) {
            const confirm = dialog.showMessageBox({
                type: 'info',
                title: 'Check Update',
                buttons: ['OK', 'Cancel'],
                message: 'Found New Version: ' + latestVersion,
                detail: `${ latestRelease.body || '' }\n\nDo you want to update to the latest version?`,
            });
            if (confirm === 0) {
                return Promise.resolve(latestRelease);
            }
        } else {
            showNoUpdateFoundDialog && dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: 'Check Update',
                message: 'No Update Found',
                detail: 'You are using the latest version.',
            });
        }
        return Promise.resolve(null);
    }).catch((e) => {
        log(e);
        if (showNoUpdateFoundDialog) {
            dialog.showErrorBox('Update Error', `Check update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
        }
        return Promise.resolve(null);
    });
}

const downloadUpdate = (release) => {
    let corePackage = null;
    if (!release) {
        return Promise.resolve(null);
    }
    try {
        const assets = release ? release.assets : [];
        for (let asset of assets) {
            if (asset.name === 'core.zip') {
                corePackage = asset;
                break;
            }
        }
    } catch (e) {}
    if (corePackage) {
        updateStatus.set('downloading');
        return io.downloadUrl(corePackage.browser_download_url).then((buffer) => {
            const zip = new JSZip(buffer);
            if (!zip || !zip.files) {
                return Promise.reject(new Error('Invalid update zip file!'));
            }
            return Promise.resolve(zip);
        }).catch((e) => {
            log(e);
            dialog.showErrorBox('Update Error', `Download update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
            return Promise.resolve(null);
        });
    } else {
        updateStatus.set('');
        dialog.showErrorBox('Update Error', `Cannot find core package. Please go to ${ APP_HOMEPAGE } to download latest release.`);
        return Promise.resolve(null);
    }
}

const applyUpdate = (zip) => {
    if (!zip) {
        return Promise.resolve(false);
    }
    updateStatus.set('applying');
    const promises = [];
    const { files } = zip;
    for (let filename in files) {
        if (files.hasOwnProperty(filename)) {
            const file = files[filename];
            if (file.dir) {
                mkdirp.sync(path.join(global.__dirname, filename));
            } else {
                const buffer = files[filename].asNodeBuffer();
                promises.push(io.writeFile(path.join(global.__dirname, filename), buffer));
            }
        }
    }
    return Promise.all(promises).then(() => {
        dialog.showMessageBox({
            buttons: ['OK'],
            type: 'info',
            title: 'Success',
            message: 'Update Complete',
            detail: `Please restart ${APP_NAME} for this update to take effect.`,
        });
        return Promise.resolve(true);
    }).catch((e) => {
        log(e);
        dialog.showErrorBox('Update Error', `Apply update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
        return Promise.resolve(false);
    });
}

export default function (interactive = true) {
    if (updateStatus.get()) {
        return;
    }
    checkUpdate(interactive)
        .then(downloadUpdate)
        .then(applyUpdate)
        .then((result) => {
            updateStatus.set('')
            if (result) {
                terminate();
            }
        });
};