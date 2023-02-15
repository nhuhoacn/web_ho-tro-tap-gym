const express = require('express');
const router = express.Router();
const ptControlller = require('../app/controllers/PtController');

router.get('/id/:id', ptControlller.show);
router.get('/page/:page', ptControlller.index);

module.exports = router;
