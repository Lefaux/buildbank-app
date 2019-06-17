const electron = require('electron');
const path = require('path');
const remote = electron.remote;

const selectButton = document.getElementById('select-folder');

selectButton.addEventListener('click', function (event) {
    remote.dialog.showOpenDialog(
        {
            title: 'Select a folder',
            properties: ["openDirectory"]
        }, (folderPath) => {
            console.log(folderPath);
        }
    );
});