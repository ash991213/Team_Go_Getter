const express = require('express');
const router = express.Router();
const userController = require('./userController.js');

router.post('/join',userController.joinpostMid);
router.post('/join/idcheck',userController.idcheckpostMid);
router.post('/login',userController.loginpostMid)
module.exports = router;