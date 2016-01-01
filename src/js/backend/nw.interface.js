const path = require('path');
const electron = global.require('electron');
const remote = electron.remote;
const Menu = remote.Menu;
const Tray = remote.Tray;
const BrowserWindow = remote.BrowserWindow;
export const app = remote.app;
export const shell = remote.shell;
export const dialog = remote.dialog;

import log from './log';
import event from './event';
import { APP_NAME, EVENT } from '../constants';

const window = () => {
    return remote.getCurrentWindow();
}

const focusCurrentWindow = () => {
    if (!window().isVisible()) {
        window().show();
    }
    if (window().isMinimized()) {
        window().restore();
    }
    window().focus();
}

let appIcon;
let settingsWindow;

event.on(EVENT.SET_HOSTS_MENU, (__menus) => {
    if (!appIcon) {
        appIcon = new Tray(path.join(global.__dirname, './assets/images/icon@16px.png'));
        appIcon.setToolTip(APP_NAME);
        appIcon.on('click', focusCurrentWindow);
    }
    const menus = [
        { label: APP_NAME, click: focusCurrentWindow },
        { type: 'separator' },
        ...__menus,
        { type: 'separator' },
        { label: 'Exit', click: () => {
            if (settingsWindow) {
                settingsWindow.close();
            }
            app.quit();
        } }
    ];
    const contextMenu = Menu.buildFromTemplate(menus);
    appIcon.setContextMenu(contextMenu);
});

event.on(EVENT.CLOSE_WINDOW, () => {
    window().close();
});
event.on(EVENT.HIDE_WINDOW, () => {
    window().hide();
});
event.on(EVENT.MINIMIZE_WINDOW, () => {
    window().minimize();
});
event.on(EVENT.MAXIMIZE_WINDOW, () => {
    window().isMaximized() ? window().unmaximize() : window().maximize();
});

event.on(EVENT.OPEN_SETTINGS_WINDOW, () => {
    if (!settingsWindow) {
        settingsWindow = new BrowserWindow({
            width: 600,
            height: 480,
            frame: false,
            resizable: false,
            transparent: true,
            icon: path.join(global.__dirname, './assets/images/icon.png'),
        });
        settingsWindow.loadURL('file://' + global.__dirname + '/settings.html');
        // settingsWindow.webContents.openDevTools();
        try {
            settingsWindow.on('closed', function() {
                settingsWindow = null;
            });
        } catch (e) {
            log(e);
        }
    } else {
        settingsWindow.focus();
    }
});

event.on(EVENT.OPEN_EXTERNAL_URL, (url) => {
    shell.openExternal(url);
});

window().on('maximize', event.emit.bind(null, EVENT.WINDOW_MAXIMIZED));
window().on('unmaximize', event.emit.bind(null, EVENT.WINDOW_UNMAXIMIZED));

export default {};