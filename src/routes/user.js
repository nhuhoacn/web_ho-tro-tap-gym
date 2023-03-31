const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');

router.get('/register', userController.register);
router.post('/register', userController.addUser);
router.get('/verify', userController.verify);
router.post('/success', userController.addUser);
router.get('/login', userController.login);
router.post('/login', userController.rememberUser);
router.get('/logout', userController.logout);
router.get('/fogetpass', userController.fogetpass);
router.post('/fogetpass', userController.resetpass);
router.get('/changepass', userController.verify_changepass);
router.post('/changepass', userController.changepasss);

module.exports = router;
