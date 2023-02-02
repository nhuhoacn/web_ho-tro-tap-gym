const express = require('express');
const router = express.Router();
const InformationController = require('../app/controllers/InformationController');

// router.get('/:slug', newsControlller.show);
router.get('/', InformationController.index);

module.exports = router;
