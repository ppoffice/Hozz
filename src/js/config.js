const path = require('path');

import Electron from './services/ElectronService';

const process = Electron.remote.process;
const {
    npm_package_name,
    npm_package_version,
    npm_package_author_name,
    npm_package_homepage,
} = process.env;

/**
 * App basic information
 */
export const APP_NAME       = npm_package_name;
export const APP_VERSION    = npm_package_version;
export const APP_AUTHOR     = npm_package_author_name;
export const APP_HOMEPAGE   = npm_package_homepage;

/**
 * App release url(for self updating)
 */
export const APP_RELEASES_URL = `https://api.github.com/repos/ppoffice/${ APP_NAME }/releases`;

export const USER_HOME      = process.platform === 'win32' ? process.env.USERPROFILE || '' : process.env.HOME || process.env.HOMEPATH || '';
export const WORKSPACE      = path.join(USER_HOME, '.' + APP_NAME);
export const MANIFEST_PATH  = path.join(WORKSPACE, './manifest.json');
export const LOG_PATH       = path.join(WORKSPACE, './log.txt');
