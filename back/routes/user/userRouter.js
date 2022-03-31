const express = require('express');
const router = express.Router();
const userController = require('./userController.js')

router.post('/join',userController.joinpost)
router.post('/idcheck',userController.idcheckpost)
router.post('/login',userController.loginpost)

module.exports = router;