const express = require('express');
const router = express.Router();
const chatController = require('./chatController.js')

router.post('/title',chatController.title)

module.exports = router;