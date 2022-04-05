const express = require('express')
const userRouter = require('./user/userRouter.js');
const boardRouter = require('./board/boardRouter.js');
const adminRouter = require('./admin/adminRouter.js');
const replyRouter = require('./reply/replyRouter.js');
const chatRouter = require('./chat/chatRouter.js');

const router = express.Router();

router.use('/user',userRouter);
router.use('/board',boardRouter);
router.use('/admin',adminRouter);
router.use('/reply',replyRouter);
router.use('/chat',chatRouter);

module.exports = router;