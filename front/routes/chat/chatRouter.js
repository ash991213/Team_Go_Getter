const express = require('express');
const router = express.Router();
const chatController = require('./chatController.js')
const { chatUser } = require('../../public/js/chatuser.js')

router.get('/list',chatController.list);
router.get('/title',chatUser,chatController.main);

module.exports = router;