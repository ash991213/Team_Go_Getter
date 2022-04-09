const express = require('express')
const userRouter = require('./user/userRouter.js');
const boardRouter = require('./board/boardRouter.js');
const adminRouter = require('./admin/adminRouter.js');
const replyRouter = require('./reply/replyRouter.js');
const chatRouter = require('./chat/chatRouter.js');
const axios = require('axios');
const { userdata } = require('../middlewares/userData.js')

const router = express.Router();

router.use('/user',userRouter);
router.use('/board',boardRouter);
router.use('/admin',adminRouter);
router.use('/reply',replyRouter);
router.use('/chat',chatRouter);

router.get('/', userdata , async (req,res)=>{
    const user = req.user
    const response = await axios.post('http://localhost:4000/user/point')

    const { board } = response.data.result
    const { reply } = response.data.result

    let category
    let maincategory
    let subcategory

    if ( user && user.level == 1 ) {
    category = await axios.post('http://localhost:4000/admin/categoryList')
        maincategory = category.data.result
        subcategory = category.data.result2
    }

    res.render('index.html', {board,reply,user,maincategory,subcategory});
});


//이미지 불러오는 라우터
router.use(express.static('views'));
router.use('/user',userRouter)
module.exports = router;