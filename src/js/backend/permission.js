const path = require('path');

import Sudoer from 'electron-sudo';
import { APP_NAME } from "../constants";

const SUDO_OPTIONS = {
    name: APP_NAME,
    icns: path.join(global.__dirname, './assets/images/icon.icns'),
    process: {
        options: {
            env: { 'LANG': 'en_US.UTF-8' }
        },
        on: () => {}
    }
};

const enableFullAccess = () => {
    let command;
    const sudoer = new Sudoer(SUDO_OPTIONS);
    switch (process.platform) {
        case 'win32':
            command = path.join(global.__dirname, './assets/scripts/win32.bat');
            break;
        case 'darwin':
        case 'linux':
            command = '/bin/chmod +a "`/usr/bin/whoami` allow read,write" /etc/hosts';
            break;
        default:
            command = '';
            break;
    }
    return sudoer.exec(command);
};

export default {
    enableFullAccess,
};
