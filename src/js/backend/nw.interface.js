const path = require('path');
const electron = global.require('electron');
export const remote = electron.remote;
const Menu = remote.Menu;
const Tray = remote.Tray;

export const app = remote.app;
export const shell = remote.shell;
export const dialog = remote.dialog;
export const ipcRenderer = electron.ipcRenderer;
export const BrowserWindow = remote.BrowserWindow;

import log from './log';
import event from './event';
import Lang from './language';
import { APP_NAME, EVENT } from '../constants';

const terminate = remote.getGlobal('terminate');
const settingsWindow = remote.getGlobal('settingsWindow');

const window = () => {
    return remote.getCurrentWindow();
}

const focusWindow = (browserWindow) => {
    if (!browserWindow.isVisible()) {
        browserWindow.show();
    }
    if (browserWindow.isMinimized()) {
        browserWindow.restore();
    }
    browserWindow.focus();
    setDockIconVisibility();
}

const focusCurrentWindow = () => {
    focusWindow(window());
}

const setDockIconVisibility = () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.some(win => win.isVisible())) {
        app.dock.show();
    } else {
        app.dock.hide();
    }
}

let appIcon;

event.on(EVENT.SET_HOSTS_MENU, (__menus) => {
    if (!appIcon) {
        if (process.platform === 'darwin') {
            appIcon = new Tray(path.join(global.__dirname, './assets/images/trayOSXTemplate.png'));
        } else  {
            appIcon = new Tray(path.join(global.__dirname, './assets/images/icon@16px.png'));
        }
        appIcon.setToolTip(APP_NAME);
        appIcon.on('click', focusCurrentWindow);
    }
    const menus = [
        { label: APP_NAME, click: focusCurrentWindow },
        { type: 'separator' },
        ...__menus,
        { type: 'separator' },
        { label: Lang.get('common.exit'), click: () => {
            terminate();
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
    setDockIconVisibility();
});
event.on(EVENT.MINIMIZE_WINDOW, () => {
    window().minimize();
});
event.on(EVENT.MAXIMIZE_WINDOW, () => {
    window().isMaximized() ? window().unmaximize() : window().maximize();
});

event.on(EVENT.OPEN_SETTINGS_WINDOW, () => {
    if (settingsWindow) {
        focusWindow(settingsWindow);
    }
});

event.on(EVENT.OPEN_EXTERNAL_URL, (url) => {
    shell.openExternal(url);
});

window().on('maximize', event.emit.bind(null, EVENT.WINDOW_MAXIMIZED));
window().on('unmaximize', event.emit.bind(null, EVENT.WINDOW_UNMAXIMIZED));

export default {};