const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.get('/register', siteController.register);
router.post('/register', siteController.addUser);
router.get('/login', siteController.login);
router.post('/login', siteController.rememberUser);
router.get('/logout', siteController.logout);
router.get('/resetpass', siteController.resetpass);
router.get('/search', siteController.search);
router.get('/', siteController.index);

module.exports = router;
