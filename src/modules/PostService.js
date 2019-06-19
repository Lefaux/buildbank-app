module.exports = {
    post: function (file) {
        const request = require('request');
        const fs = require('fs');
        const url = 'https://example.dev/upload';

        let req = request.post(url, function (err, resp, body) {
            if (err) {
                console.log('Error!');
            } else {
                console.log('URL: ' + body);
            }
        });
        let form = req.form();
        form.append('file', fs.createReadStream(file));
        console.log('File posted');
    }
};