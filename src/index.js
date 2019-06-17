const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;

const chooseBtn = document.getElementById('select-folder');
const placeHolder = document.getElementById('wow-folder');

chooseBtn.addEventListener('click', function(event) {
    remote.dialog.showOpenDialog(
        {
            title: 'Select a folder',
            properties: ["openDirectory"]
        }, (folderPath) => {
            placeHolder.setAttribute('placeholder', folderPath);
        }
    );
});