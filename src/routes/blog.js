const express = require('express');
const router = express.Router();
const blogControlller = require('../app/controllers/BlogController');

router.get('/', blogControlller.index);

module.exports = router;
