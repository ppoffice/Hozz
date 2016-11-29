const path = require('path');
const sudo = global.require('electron-sudo');

import { APP_NAME } from '../constants';

const SUDO_OPTION = {
    name: APP_NAME,
    icns: path.join(global.__dirname, './assets/images/icon.icns'),
    process: {
        options: {
            env: { 'LANG': 'en_US.UTF-8' }
        },
        on: () => {}
    }
};

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

const enableFullAccess = () => {
    let command;
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
