const express = require('express');
const router = express.Router();
const adminController = require('./adminController.js')

router.post('/login',adminController.login);

module.exports = router;