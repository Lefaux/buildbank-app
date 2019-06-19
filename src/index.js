const electron = require('electron');
const path = require('path');
const storage = require('electron-json-storage');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;

const chooseBtn = document.getElementById('select-folder');
const placeHolder = document.getElementById('wow-folder');

placeHolder.value = storage.get('folder', null);
storage.get('folderPath', function(error, data) {
    if (error) throw error;

    if (undefined !== data['folder'] && null !== data['folder']) {
        placeHolder.value = data['folder'];
    }
});

chooseBtn.addEventListener('click', function(event) {
    remote.dialog.showOpenDialog(
        {
            title: 'Select a folder',
            properties: ["openDirectory"]
        }, (folderPath) => {
            placeHolder.setAttribute('placeholder', folderPath);
            console.log(folderPath);
            storage.set('folderPath', { folder: folderPath }, function(error) {
                if (error) throw error;
                console.log("stored");
            });
        }
    );
});