const express = require('express');
const router = express.Router();
const newsControlller = require('../app/controllers/NewsController');

router.get('/:slug', newsControlller.show);
router.get('/', newsControlller.index);

module.exports = router;
