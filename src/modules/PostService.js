module.exports = {
    post: function (file) {
        const request = require('request');
        const fs = require('fs');
        //const auth = Buffer.from('someApiToken').toString('base64');

        const options = {
            method: "POST",
            url: "https://www.molten-core-salvage-ops.com/update",
            port: 443,
            //headers: {
            //    "Authorization": "Basic " + auth,
            //    "Content-Type": "multipart/form-data"
            //},
            formData: {
                "file": fs.createReadStream(file)
            }
        };

        console.log('Starting upload for ' + file);

        request(options, function (err, res, body) {
            if (err) return;

            console.log('Uploaded ' + file);
        });
    }
};