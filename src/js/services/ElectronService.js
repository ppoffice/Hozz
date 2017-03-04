const path = require('path');
const electron = global.require('electron');
const remote = electron.remote;
const Menu = remote.Menu;
const Tray = remote.Tray;
const MenuItem = remote.MenuItem;
const BrowserWindow = remote.BrowserWindow;

/**
 * Set visibility of Docker icon of OS X
 */
const setDockIconVisibility = () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.some(win => win.isVisible())) {
        app.dock.show();
    } else {
        app.dock.hide();
    }
}

/**
 * Focus to the current window
 */
const focusCurrentWindow = () => {
    const browserWindow = remote.getCurrentWindow();
    if (!browserWindow.isVisible())
        browserWindow.show();
    if (!browserWindow.isMinimized())
        browserWindow.restore();
    browserWindow.focus();
    setDockIconVisibility();
}

export default { remote, Menu, MenuItem, Tray, focusCurrentWindow }
