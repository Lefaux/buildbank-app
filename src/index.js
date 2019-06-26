const electron = require('electron');
const path = require('path');
const storage = require('electron-json-storage');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const fs = require('fs');
const JSON5 = require('json5');

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

function buildCheckBoxes(rootFolder) {
    storage.get('accountFolders', function (error, storageFolders) {
        if (undefined === storageFolders['folders'] || null === storageFolders['folders']) {
            return;
        }

        storage.get('allowedAccounts', async function (error, accounts) {
            if (undefined === accounts['accounts']) {
                accounts['accounts'] = [];
            }
            for (let i = 0; i < storageFolders['folders'].length; i++) {
                buildCharacterCheckBoxes(storageFolders['folders'][i], rootFolder);
            }
        });
    });
}

function checkRootPath(folderPath) {
    storage.set('accountFolders', {folders: getDirectories(folderPath)}, function (error) {
        if (error) throw error;
        buildCheckBoxes(folderPath);
    });
}

function readLua(filePath, cb) {
    var str = '';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) data = '';
        cb(data);
    });
}

function buildCharacterCheckBoxes(account, storagePath) {
    let fullPath = storagePath + '/WTF/Account/' + account + '/SavedVariables/GuildBankManager.lua';

    readLua(fullPath, function (data) {

        data = data.replace(/\["/g, '"')
            .replace(/"\]/g, '"')
            .replace(/\[/g, '"')
            .replace(/\]/g, '"')
            .replace(/,}/g, '}')
            .replace(/=/g, ':')
            .replace('gbm_excepts', '"gbm_excepts"')
            .replace('gbm_bank', '"gbm_bank"')
            .replace('gbm_guildmembers', '"gbm_guildmembers"')
            .replace(/}/g, '},')
            .replace(/,,/g, ',')
            .replace(/: nil/g, ': null,');

        data = '{' + data + '}';

        const json = JSON5.parse(data);

        let header = document.createElement('h3');
        let t = document.createTextNode(account);
        header.appendChild(t);
        container.append(header);


        for (let propertyName in json['gbm_bank']) {
            console.log(propertyName);

            storage.get('allowedCharacters', async function (error, characters) {
                if (undefined === characters['characters']) {
                    characters['characters'] = [];
                }
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = propertyName;
                checkbox.value = "value";
                checkbox.id = propertyName;
                if (characters['characters'].includes(propertyName)) {
                    checkbox.checked = true;
                }

                var label = document.createElement('label');
                label.htmlFor = propertyName;
                label.appendChild(document.createTextNode(propertyName));

                container.appendChild(checkbox);
                container.appendChild(label);
                container.appendChild(document.createElement('br'));

                document.getElementById(propertyName).addEventListener('change', function () {
                    if (document.getElementById(propertyName).checked) {
                        if (!characters['characters'].includes(propertyName)) {
                            characters['characters'].push(propertyName);
                        }
                    } else {
                        for (var j = 0; j < characters['characters'].length; j++) {
                            if (characters['characters'][j] === propertyName) {
                                characters['characters'].splice(j, 1);
                            }
                        }
                    }
                    storage.set('allowedCharacters', {characters: characters['characters']}, null);
                });
            });
        }
    });
}