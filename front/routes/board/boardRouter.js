const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js')

router.get('/list',boardController.list);
router.get('/category',boardController.category);
router.get('/view',boardController.view);
router.get('/write',boardController.write);
router.get('/edit',boardController.edit);

module.exports = router;