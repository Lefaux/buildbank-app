const electron = require('electron');
const path = require('path');
const storage = require('electron-json-storage');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const fs = require('fs');

const chooseBtn = document.getElementById('select-folder');
const placeHolder = document.getElementById('wow-folder');
const container = document.getElementById('settings');

placeHolder.value = storage.get('folder', null);
storage.get('folderPath', function (error, data) {
    if (error) throw error;

    if (undefined !== data['folder'] && null !== data['folder']) {
        placeHolder.value = data['folder'];
    }
});

chooseBtn.addEventListener('click', function (event) {
    remote.dialog.showOpenDialog(
        {
            title: 'Select a folder',
            properties: ["openDirectory"]
        }, (folderPath) => {
            if (undefined === folderPath) {
                return;
            }
            placeHolder.value = folderPath;
            storage.set('folderPath', {folder: folderPath}, function (error) {
                if (error) throw error;
                storage.set('accountFolders', {folders: getDirectories(folderPath)}, function (error) {
                    if (error) throw error;
                    storage.get('accountFolders', function (error, storageFolders) {
                        if (undefined === storageFolders['folders'] || null === storageFolders['folders']) {
                            return;
                        }

                        for (let i = 0; i < storageFolders['folders'].length; i++) {
                            var checkbox = document.createElement('input');
                            checkbox.type = "checkbox";
                            checkbox.name = storageFolders['folders'][i];
                            checkbox.value = "value";
                            checkbox.id = storageFolders['folders'][i];

                            var label = document.createElement('label');
                            label.htmlFor = storageFolders['folders'][i];
                            label.appendChild(document.createTextNode(storageFolders['folders'][i]));

                            container.appendChild(checkbox);
                            container.appendChild(label);
                            container.appendChild(document.createElement('br'));

                            document.getElementById(storageFolders['folders'][i]).addEventListener('change', function () {
                                if (document.getElementById(storageFolders['folders'][i]).checked) {
                                    console.log(document.getElementById(storageFolders['folders'][i]).name);
                                }
                            });
                        }
                    });
                });
            });
        }
    );
});

function getDirectories(storagePath) {
    return fs.readdirSync(storagePath + '/WTF/Account').filter(function (file) {
        return fs.statSync(storagePath + '/WTF/Account/' + file).isDirectory();
    });
}
