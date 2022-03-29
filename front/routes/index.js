const express = require('express')
const userRouter = require('./user/userRorter.js');
const boardRouter = require('./board/boardRouter.js');
const adminRouter = require('./admin/adminRouter.js');
const replyRouter = require('./reply/replyRouter.js');

const router = express.Router();

router.use('/user',userRouter);
router.use('/board',boardRouter);
router.use('/admin',adminRouter);
router.use('/reply',replyRouter);

router.get('/',(req,res)=>{
    res.render('index.html');
});
router.get('/board_list',(req,res)=>{
    res.render('board_list.html');
});

//이미지 불러오는 라우터
router.use(express.static('views'));

module.exports = router;