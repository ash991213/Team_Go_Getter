const express = require('express');
const router = express.Router();
const boardController = require('./boardController.js')

router.get('/write',boardController.write);
router.get('/edit',boardController.edit);
router.get('/board_list',(req,res)=>{
    res.render('board_list.html');
});
router.get('/board_view',(req,res)=>{
    res.render('board_view.html')
});
module.exports = router;