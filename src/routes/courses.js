const express = require('express');
const router = express.Router();
const courseControlller = require('../app/controllers/CourseController');

router.get('/create', courseControlller.create);
router.post('/store', courseControlller.store);
router.get('/:slug', courseControlller.show);

module.exports = router;
