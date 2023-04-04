const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');

router.get('/manage_user', adminController.manage_user);
router.get('/manage_blog', adminController.manage_blog);
router.get('/manage_class', adminController.manage_class);
router.post('/delete_user', adminController.delete_user);
router.post('/block_user', adminController.block_user);
router.post('/unblock_user', adminController.unblock_user);
router.post('/cancel_admin', adminController.cancel_admin);
router.post('/add_admin', adminController.add_admin);
router.get('/', adminController.index);

module.exports = router;
