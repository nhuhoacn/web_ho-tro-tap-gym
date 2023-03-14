const express = require('express');
const router = express.Router();
const infoControlller = require('../app/controllers/InformationController');

router.get('/', infoControlller.index);

module.exports = router;
