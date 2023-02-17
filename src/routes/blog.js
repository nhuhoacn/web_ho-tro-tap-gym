const express = require('express');
const router = express.Router();
const blogControlller = require('../app/controllers/BlogController');

router.get('/create', blogControlller.create);
router.post('/create', blogControlller.insert_blog);
router.get('/id/:id', blogControlller.show);
router.get('/page/:page', blogControlller.index);

module.exports = router;
