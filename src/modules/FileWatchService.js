module.exports = {
    watch: function (fullPath) {
        const fileToWatch = 'GuildBankManager.lua';
        const fs = require('fs');
        const md5 = require('md5');
        const postService = require('./PostService');

        let md5Previous = null;
        let fsWait = false;
        fullPath = fullPath + '/' + fileToWatch;

        if (fs.existsSync(fullPath)) {
            console.log('Watching ' + fullPath);
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
                    postService.post(fullPath);
                    console.log(`${filename} file Changed`);
                }
            });
        }
    }
};