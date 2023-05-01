// uploadMiddleware.js

const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, res) => {
        res(
            null,
            'C:/Users/Admin/Documents/nodeJS/web-fitness/src/public/img/user',
        );
    },
    filename: (req, file, res) => {
        res(null, Date.now() + '_' + file.originalname);
    },
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
});

module.exports = upload;
