const express = require('express');
const router = express.Router();
const upload = require('../util/uploadMiddleware_blog');
const blogControlller = require('../app/controllers/BlogController');

router.get('/create', blogControlller.create);
router.post(
    '/create',
    upload.single('image_blog'),
    blogControlller.insert_blog,
);
router.get('/change_blog', blogControlller.change_blog);
router.post(
    '/change_blog',
    upload.single('image_blog'),
    blogControlller.save_change,
);
router.get('/id/:id', blogControlller.detail);
router.post('/id/:id', blogControlller.comment_new);
router.get('/page/:page', blogControlller.index);
router.get('/topic/:topic/:page', blogControlller.blog_topic);
router.post('/delete_blog', blogControlller.delete_blog);

module.exports = router;
