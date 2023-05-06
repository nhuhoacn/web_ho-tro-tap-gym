const express = require('express');
const router = express.Router();
const upload = require('../util/uploadMiddleware');
const infoControlller = require('../app/controllers/InformationController');

router.get('/change_info', infoControlller.changeinfo);
router.post(
    '/change_info',
    upload.single('image'),
    infoControlller.savechangeinfo,
);
router.get('/', infoControlller.index);

module.exports = router;
