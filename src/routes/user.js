const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');

router.get('/register', userController.register);
router.post('/register', userController.addUser);
router.get('/login', userController.login);
router.post('/login', userController.rememberUser);
router.get('/logout', userController.logout);
router.get('/resetpass', userController.resetpass);

module.exports = router;
