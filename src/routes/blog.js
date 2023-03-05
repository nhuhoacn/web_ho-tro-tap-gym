const express = require('express');
const router = express.Router();
const blogControlller = require('../app/controllers/BlogController');

router.get('/create', blogControlller.create);
router.post('/create', blogControlller.insert_blog);
router.get('/id/:id', blogControlller.detail);
router.post('/id/:id', blogControlller.comment_new);
router.get('/page/:page', blogControlller.index);
router.get('/topic/:topic/:page', blogControlller.blog_topic);

module.exports = router;
