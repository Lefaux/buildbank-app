// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const shell = require('electron').shell;
const fs = require('fs');
const md5 = require('md5');
const storage = require('electron-json-storage');
const postService = require('./src/modules/PostService');
const fileToWatch = 'GuildBankManager.lua';

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
    mainWindow.webContents.openDevTools();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'Set path to WoW Folder',
                    click() {
                        shell.openExternal('https://typo3.com')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Exit',
                    click() {
                        app.quit()
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
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

let md5Previous = null;
let fsWait = false;
storage.get('folderPath', function (error, data) {
    if (error) return;

    if (undefined === data['folder'] || null === data['folder']) {
        return;
    }

    let fullPath = data['folder'] + '/' + fileToWatch;

    fs.watch(fullPath, (event, filename) => {
        if (filename) {
            if (fsWait) return;
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);
            const md5Current = md5(fs.readFileSync(fullPath));
            if (md5Current === md5Previous) {
                return;
            }
            md5Previous = md5Current;
            postService.post(fullPath)
            console.log(`${filename} file Changed`);
        }
    });
});