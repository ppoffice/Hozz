const path = require('path');

import Sudoer from 'electron-sudo';
import { APP_NAME } from "../constants";

const OPTIONS = {
    name: APP_NAME,
    icns: path.join(global.__dirname, './assets/images/icon.icns')
};
const ENV = { 'LANG': 'en_US.UTF-8' };

const enableFullAccess = () => {
    let command;
    const sudoer = new Sudoer(OPTIONS);
    switch (process.platform) {
        case 'win32':
            command = "\"" + path.join(global.__dirname, './assets/scripts/win32.bat') + "\"";
            break;
        case 'darwin':
            command = '/bin/chmod +a "`/usr/bin/whoami` allow read,write" /etc/hosts';
            break;
        case 'linux':
            command = '/bin/sh ' + path.join(global.__dirname, './assets/scripts/linux.sh') + ' ' + process.env.USER;
            break;
        default:
            command = '';
            break;
    }
    return sudoer.exec(command, { env: ENV });
};

export default {
    enableFullAccess,
};
