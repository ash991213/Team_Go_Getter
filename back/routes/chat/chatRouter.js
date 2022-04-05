const express = require('express');
const router = express.Router();
const chatController = require('./chatController.js')

router.post('/user',chatController.user);

module.exports = router;