'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

const menuTemplate = [
    {
        label: 'Hozz',
        submenu: [
            {
                label: 'Exit',
                accelerator: 'Cmd+Q',
                click: function () {
                    global.terminate();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'Cmd+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+Cmd+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'Cmd+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'Cmd+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'Cmd+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'Cmd+A',
                selector: 'selectAll:'
            }
        ]
    },
];
const menu = Menu.buildFromTemplate(menuTemplate);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let settingsWindow;
let shouldQuit = false;

global.updateStatus = (function () {
    let status = '';
    return {
        get () {
            return status;
        },

        set (value) {
            status = value;
            if (settingsWindow) {
                settingsWindow.webContents.send('UPDATE_STATUS', value);
            }
        }
    };
})();

global.terminate = function () {
    shouldQuit = true;
    app.quit();
};

if (process.platform === 'linux') {
    app.commandLine.appendSwitch('enable-transparent-visuals');
    app.commandLine.appendSwitch('disable-gpu');
}

// Someone tried to run a second instance, we should focus our window
var shouldStartInstance = app.makeSingleInstance(function(commandLine, workingDirectory) {
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

if (shouldStartInstance) {
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
    // mainWindow.webContents.openDevTools();
    mainWindow.on('close', function(e) {
        if (!shouldQuit) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    settingsWindow = new BrowserWindow({
        width: 600,
        height: 480,
        frame: false,
        resizable: false,
        transparent: true,
        icon: path.join(__dirname, './assets/images/icon.png'),
    });
    settingsWindow.loadURL('file://' + __dirname + '/settings.html');
    settingsWindow.hide();
    // settingsWindow.webContents.openDevTools();
    settingsWindow.on('close', function(e) {
        if (!shouldQuit) {
            e.preventDefault();
            settingsWindow.hide();
        }
    });
    settingsWindow.on('closed', function() {
        settingsWindow = null;
    });

    global.settingsWindow = settingsWindow;

    if (process.platform == "darwin") {
        Menu.setApplicationMenu(menu);
    };

});
