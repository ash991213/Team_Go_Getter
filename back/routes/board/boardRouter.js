const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js')

router.post('/write',boardController.write);
router.get('/edit',boardController.GetEdit);
router.post('/edit',boardController.PostEdit);

module.exports = router;