const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js')

router.get('/write',boardController.write);

module.exports = router;