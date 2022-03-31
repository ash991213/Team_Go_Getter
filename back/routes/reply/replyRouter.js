const express = require('express');
const router = express.Router();
const replyController = require('./replyController.js');

router.post('/mainwrite',replyController.mainwrite);
router.post('/subwrite',replyController.subwrite);
router.post('/view',replyController.view);
router.post('/edit',replyController.edit);
router.post('/delete',replyController.delete);
router.post('/likes',replyController.likes);
router.post('/dislikes',replyController.dislikes);

module.exports = router;