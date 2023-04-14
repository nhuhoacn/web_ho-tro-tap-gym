const express = require('express');
const multer = require('multer');
const router = express.Router();
const blogControlller = require('../app/controllers/BlogController');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/blog');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
});
var upload = multer({ storage: storage });
router.get('/create', blogControlller.create);
router.post('/create', upload.single('myFile'), blogControlller.insert_blog);
router.get('/change_blog', blogControlller.change_blog);
router.post('/change_blog', blogControlller.save_change);
router.get('/id/:id', blogControlller.detail);
router.post('/id/:id', blogControlller.comment_new);
router.get('/page/:page', blogControlller.index);
router.get('/topic/:topic/:page', blogControlller.blog_topic);
router.post('/delete_blog', blogControlller.delete_blog);

module.exports = router;
