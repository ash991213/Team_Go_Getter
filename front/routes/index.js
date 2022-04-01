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
router.get('/main_category',(req,res)=>{
    res.render('main_category.html');
});
router.get('/sub_category',(req,res)=>{
    res.render('sub_category.html');
});
<<<<<<< HEAD
router.get('/board_view',(req,res)=>{
    res.render('board_view.html');
});
=======
>>>>>>> 7d926ba2c9bb3eeb1e30b532125b5ef68eb58c65

//이미지 불러오는 라우터
router.use(express.static('views'));

module.exports = router;