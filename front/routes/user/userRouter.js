const express = require('express');
const router = express.Router();
const userController = require('./userController.js')

router.get('join',userController.joinget)

module.exports = router;