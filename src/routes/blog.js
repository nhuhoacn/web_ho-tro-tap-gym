const express = require('express');
const router = express.Router();
const upload = require('../util/uploadMiddleware');
const blogControlller = require('../app/controllers/BlogController');

router.get('/create', blogControlller.create);
router.post('/create', blogControlller.insert_blog);
router.get('/change_blog', blogControlller.change_blog);
router.post('/change_blog', blogControlller.save_change);
router.get('/id/:id', blogControlller.detail);
router.post('/id/:id', blogControlller.comment_new);
router.get('/page/:page', blogControlller.index);
router.get('/topic/:topic/:page', blogControlller.blog_topic);
router.post('/delete_blog', blogControlller.delete_blog);
router.post('/them_anh', upload.single('image'), blogControlller.new_image);
router.get('/them_anh', blogControlller.create_image);

module.exports = router;
