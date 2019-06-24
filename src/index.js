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
        checkRootPath(data['folder']);
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
                checkRootPath(folderPath);
            });
        }
    );
});

function getDirectories(storagePath) {
    return fs.readdirSync(storagePath + '/WTF/Account').filter(function (file) {
        return fs.statSync(storagePath + '/WTF/Account/' + file).isDirectory();
    });
}

function buildCheckBoxes() {
    storage.get('accountFolders', function (error, storageFolders) {
        if (undefined === storageFolders['folders'] || null === storageFolders['folders']) {
            return;
        }

        storage.get('allowedAccounts', function (error, accounts) {
            if (undefined === accounts['accounts']) {
                accounts['accounts'] = [];
            }
            for (let i = 0; i < storageFolders['folders'].length; i++) {
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = storageFolders['folders'][i];
                checkbox.value = "value";
                checkbox.id = storageFolders['folders'][i];
                if (accounts['accounts'].includes(storageFolders['folders'][i])) {
                    checkbox.checked = true;
                }

                var label = document.createElement('label');
                label.htmlFor = storageFolders['folders'][i];
                label.appendChild(document.createTextNode(storageFolders['folders'][i]));

                container.appendChild(checkbox);
                container.appendChild(label);
                container.appendChild(document.createElement('br'));

                document.getElementById(storageFolders['folders'][i]).addEventListener('change', function () {
                    if (document.getElementById(storageFolders['folders'][i]).checked) {
                        if (!accounts['accounts'].includes(storageFolders['folders'][i])) {
                            accounts['accounts'].push(storageFolders['folders'][i]);
                        }
                    } else {
                        for (var j = 0; j < accounts['accounts'].length; j++) {
                            if (accounts['accounts'][j] === storageFolders['folders'][i]) {
                                accounts['accounts'].splice(j, 1);
                            }
                        }
                    }
                    storage.set('allowedAccounts', {accounts: accounts['accounts']}, null);
                });
            }
        });
    });
}

function checkRootPath(folderPath) {
    storage.set('accountFolders', {folders: getDirectories(folderPath)}, function (error) {
        if (error) throw error;
        buildCheckBoxes();
    });
}