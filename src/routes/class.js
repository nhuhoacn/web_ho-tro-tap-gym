const express = require('express');
const router = express.Router();
const classControlller = require('../app/controllers/ClassController');

router.get('/:slug', classControlller.detail);
router.get('/', classControlller.show);

module.exports = router;
