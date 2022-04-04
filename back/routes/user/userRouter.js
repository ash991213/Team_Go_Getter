const express = require('express');
const router = express.Router();
const userController = require('./userController.js')

router.post('/join',userController.joinpost)
router.post('/idcheck',userController.idcheckpost)
router.post('/login',userController.loginpost)
router.get('/edit',userController.getEdit)
router.post('/edit',userController.postEdit)
router.post('/logout',userController.logout)
router.post('/quit',userController.logout)
router.post('/list',userController.list)
router.post('/find',userController.find)
router.post('/data',userController.data)
router.post('/point',userController.point)

module.exports = router;