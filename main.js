// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const shell = require('electron').shell;
const storage = require('electron-json-storage');
const watcher = require('./src/modules/FileWatchService');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('src/index.html');
    //mainWindow.webContents.openDevTools();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});

storage.get('folderPath', function (error, data) {
    if (error) return;

    if (undefined === data['folder'] || null === data['folder']) {
        return;
    }

    storage.get('accountFolders', function (error, storageFolders) {
        if (undefined === storageFolders['folders'] || null === storageFolders['folders']) {
            return;
        }

        for (let i = 0; i < storageFolders['folders'].length; i++) {
            watcher.watch(data['folder'] + '/WTF/Account/' + storageFolders['folders'][i] + '/SavedVariables');
        }

    });
});