const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js')

router.get('/list',boardController.list);
router.get('/category',boardController.category);
router.get('/view',boardController.view);

module.exports = router;