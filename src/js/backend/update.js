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

const checkUpdate = (isBackend = false) => {
    updateStatus('checking');
    return io.requestUrl(APP_RELEASES_URL).then((json) => {
        updateStatus('');
        const releases = JSON.parse(json).sort((A, B) => {
            return B.id - A.id;
        });
        const latestRelease = releases[0];
        const latestVersion = latestRelease.tag_name[0] === 'v' ?
                              latestRelease.tag_name.slice(1) :
                              latestRelease.tag_name;
        if (isNewVersion(APP_VERSION, latestVersion)) {
            const confirm = dialog.showMessageBox({
                buttons: ['OK', 'Cancel'],
                type: 'info',
                title: 'Check Update',
                message: 'Found New Version: ' + latestVersion,
                detail: `${ latestRelease.body || '' }\nDo you want to update to the latest version?`,
            });
            if (confirm === 0) {
                return Promise.resolve(latestRelease);
            }
        } else {
            !isBackend && dialog.showMessageBox({
                buttons: ['OK'],
                type: 'info',
                title: 'Check Update',
                message: 'No Update Found',
                detail: 'You are using the latest version.',
            });
        }
        return Promise.resolve();
    }).catch((e) => {
        updateStatus('');
        log(e);
        !isBackend && dialog.showErrorBox('Update Error', `Check update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
        return Promise.resolve();
    });
}

const downloadUpdate = (release) => {
    let corePackage = null;
    if (!release) {
        updateStatus('');
        return Promise.resolve();
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
        updateStatus('downloading');
        return io.downloadUrl(corePackage.browser_download_url).then((buffer) => {
            updateStatus('');
            const zip = new JSZip(buffer);
            if (!zip || !zip.files) {
                return Promise.reject(new Error('Invalid update zip file!'));
            }
            return Promise.resolve(zip);
        }).catch((e) => {
            updateStatus('');
            log(e);
            dialog.showErrorBox('Update Error', `Download update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
            return Promise.resolve(null);
        });
    } else {
        updateStatus('');
        dialog.showErrorBox('Update Error', `Download update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
        return Promise.resolve(null);
    }
}

const applyUpdate = (zip) => {
    updateStatus('applying');
    if (!zip) {
        updateStatus('');
        return Promise.resolve();
    }
    const { files } = zip;
    const promises = [];
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
            detail: 'Please restart ' + APP_NAME + ' for this update to take effect.',
        });
        app.quit();
    }).catch((e) => {
        updateStatus('');
        log(e);
        dialog.showErrorBox('Update Error', `Apply update failed. Please go to ${ APP_HOMEPAGE } to download latest release.`);
        return Promise.resolve(null);
    });
}

const backendUpdate = () => {
    if (!updateStatus()) {
        checkUpdate(true).then((release) => {
            if (release) {
                return downloadUpdate(release);
            }
            return Promise.resolve();
        }).then((zip) => {
            if (zip) {
                return applyUpdate(zip);
            }
            return Promise.resolve();
        });
    }
}

export default {
    checkUpdate,
    applyUpdate,
    backendUpdate,
    downloadUpdate,
};