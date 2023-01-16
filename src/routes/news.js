const express = require('express')
const router = express.Router()
const newsControlller = require('../app/controllers/NewsController')

router.use('/:slug', newsControlller.show)
router.use('/', newsControlller.index)

module.exports = router;