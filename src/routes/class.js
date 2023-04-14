const express = require('express');
const router = express.Router();
const classControlller = require('../app/controllers/ClassController');

router.post('/cancel_class', classControlller.cancel_class);
router.post('/delete_class', classControlller.delete_class);
router.get('/change_class', classControlller.change_class);
router.post('/change_class', classControlller.save_change);
router.get('/create', classControlller.create);
router.post('/create', classControlller.new_class);
router.post('/', classControlller.register_class);
router.get('/', classControlller.show);

module.exports = router;
