const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js');
const { upload } = require('../../utils/upload.js');

router.get('/write',boardController.GetWrite);
router.post('/write',upload.fields({name:'upload1'},{name:'upload2'},{name:'upload3'},{name:'upload4'},{name:'upload5'}),boardController.PostWrite);
router.post('/view',boardController.view);
router.post('/list',boardController.list);
router.post('/mainList',boardController.mainList);
router.post('/subList',boardController.subList);
router.post('/getEdit',boardController.GetEdit);
router.post('/edit',boardController.PostEdit);
router.post('/delete',boardController.delete);
router.post('/likes',boardController.likes);
router.post('/dislikes',boardController.dislikes);
router.post('/down',boardController.down);
router.post('/find',boardController.find);

module.exports = router;