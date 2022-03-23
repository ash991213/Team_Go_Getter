const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js')

router.post('/write',boardController.write);

module.exports = router;