const express = require('express');
const router = express.Router();
const classControlller = require('../app/controllers/ClassController');

router.post('/cancel_class', classControlller.cancel_class);
router.post('/', classControlller.register_class);
router.get('/', classControlller.show);

module.exports = router;
