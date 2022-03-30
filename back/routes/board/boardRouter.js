const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js');
const { upload } = require('../../utils/upload.js');

router.post('/write',upload.fields({name:'upload1'},{name:'upload2'},{name:'upload3'},{name:'upload4'},{name:'upload5'}),boardController.write);
router.post('/view',boardController.view);
router.post('/list',boardController.list);
router.post('/mainList',boardController.mainList);
router.post('/subList',boardController.subList);
router.get('/edit',boardController.GetEdit);
router.post('/edit',boardController.PostEdit);
router.post('/delete',boardController.delete);
router.post('/likes',boardController.likes);
router.post('/dislikes',boardController.dislikes);
router.post('/down',boardController.down);

module.exports = router;