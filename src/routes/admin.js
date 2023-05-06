const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');

router.get('/manage_user/page/:page', adminController.manage_user_page);
router.get('/manage_user', adminController.manage_user);
router.get('/manage_blog', adminController.manage_blog);
router.get('/manage_class', adminController.manage_class);
router.get('/', adminController.index);

module.exports = router;
