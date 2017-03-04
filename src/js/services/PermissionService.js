const path = require('path');
const sudo = global.require('./node_modules/electron-sudo');

import { APP_NAME } from '../config';

/**
 * Some configurations for electron-sudo
 */
const SUDO_OPTION = {
    name: APP_NAME,
    // Icon used for OS X
    icns: path.join(global.__dirname, './assets/images/icon.icns'),
    process: {
        options: {
            env: { 'LANG': 'en_US.UTF-8' }
        },
        on: () => {}
    }
};

/**
 * Promisefy sudo command execution
 * @param  {String} command Shell code to run in sudo mode
 * @return {Promise}        Promise for result handling
 */
const sudoExec = (command) => {
    return new Promise((resolve, reject) => {
        sudo.exec(command, SUDO_OPTION, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            return resolve(stdout, stderr);
        });
    });
};

/**
 * Set /etc/hosts file to 644 permissions
 * @return {Promise} Promise for result handling
 */
const enableFullAccess = () => {
    let command;
    // Mind differences between OS X and Linux
    switch (process.platform) {
        case 'win32':
            command = path.join(global.__dirname, './assets/scripts/win32.bat');
            break;
        case 'darwin':
            command = '/usr/sbin/chown `/usr/bin/whoami` /etc/hosts && /bin/chmod 644 /etc/hosts';
            break;
        case 'linux':
            command = '/bin/chown `/usr/bin/whoami` /etc/hosts && /bin/chmod 644 /etc/hosts';
            break;
        default:
            command = '';
            break;
    }
    return sudoExec(command);
}

export default {
    enableFullAccess,
};
