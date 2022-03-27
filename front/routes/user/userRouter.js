const express = require('express');
const router = express.Router();
const userController = require('./userController.js');

router.get('/join',userController.joingetMid)


module.exports = router;