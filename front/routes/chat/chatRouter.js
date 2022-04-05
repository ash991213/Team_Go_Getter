const express = require('express');
const router = express.Router();
const chatController = require('./chatController.js')

router.get('/list',chatController.list);
router.get('/title',chatController.main);

module.exports = router;