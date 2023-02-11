const express = require('express');
const router = express.Router();
const eControlller = require('../app/controllers/BlogController');

router.get('/create', blogControlller.create);
router.post('/create', blogControlller.insert_blog);
router.get('/:id', blogControlller.show);
router.get('/', blogControlller.index);

module.exports = router;
