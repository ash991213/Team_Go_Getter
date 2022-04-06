const express = require('express')
const userRouter = require('./user/userRouter.js');
const boardRouter = require('./board/boardRouter.js');
const adminRouter = require('./admin/adminRouter.js');
const replyRouter = require('./reply/replyRouter.js');
const chatRouter = require('./chat/chatRouter.js');
const axios = require('axios');

const router = express.Router();

router.use('/user',userRouter);
router.use('/board',boardRouter);
router.use('/admin',adminRouter);
router.use('/reply',replyRouter);
router.use('/chat',chatRouter);

router.get('/', async (req,res)=>{
    // const response = await axios.post('http://localhost:4000/user/point') 

    // const { board } = response.data.result
    // const { reply } = response.data.result
    // console.log(response.data);
    // console.log(board)
    // console.log(reply)

<<<<<<< HEAD
    res.render('index.html' );
    // ,{board,reply}
=======
    res.render('index.html', {board,reply});
>>>>>>> cd8d506e1a2a906c98adb6cf81cb4c5a8a19260e
});

router.get('/main_category',(req,res)=>{
    res.render('main_category.html');
});
router.get('/sub_category',(req,res)=>{
    res.render('sub_category.html');
});
router.get('/board_list',(req,res)=>{
    res.render('board_list.html');
});
router.get('#join_frm',(req,res)=>{
    res.render('index.html');
});
router.get('/board_view',(req,res)=>{
    res.render('board_view.html')
});


//이미지 불러오는 라우터
router.use(express.static('views'));
router.use('/user',userRouter)
module.exports = router;