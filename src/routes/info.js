const express = require('express');
const router = express.Router();
const infoControlller = require('../app/controllers/InformationController');

router.get('/change_info', infoControlller.changeinfo);
router.post('/change_info', infoControlller.savechangeinfo);
router.get('/', infoControlller.index);

module.exports = router;
