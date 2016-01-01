'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const updateStatus = (function () {
    let __updateStatus = '';
    return function (value) {
        if (typeof(value) !== 'undefined') {
            __updateStatus = value;
        }
        return __updateStatus;
    };
})();

// Export global to store status
global.updateStatus = updateStatus;

if (process.platform === 'linux') {
    app.commandLine.appendSwitch('--enable-transparent-visuals');
    app.commandLine.appendSwitch('--disable-gpu');
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit();
});

// Someone tried to run a second instance, we should focus our window
var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    if (mainWindow) {
        if (!mainWindow.isVisible()) {
            mainWindow.show();
        }
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
    return true;
});

if (shouldQuit) {
    app.quit();
    return;
}

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 960,
        height: 640,
        frame: false,
        transparent: true,
        icon: path.join(__dirname, './assets/images/icon.png'),
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // mainWindow.hide();
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
