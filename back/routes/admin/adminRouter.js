const express = require('express');
const router = express.Router();
const adminController = require('./adminController.js')

router.post('/login',adminController.login);
router.post('/logout',adminController.logout);
router.post('/mainCategory',adminController.mainCategory);
router.post('/subCategory',adminController.subCategory);
router.post('/categoryList',adminController.categoryList);
router.post('/mainDelete',adminController.mainDelete);
router.post('/subDelete',adminController.subDelete);
router.get('/userEdit',adminController.getUserEdit)
router.post('/userEdit',adminController.postUserEdit)

module.exports = router;