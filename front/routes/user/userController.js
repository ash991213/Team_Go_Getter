const express = require('express');
const router = express.Router()
const userController = require('./userController.js')
const {createToken} = require('../../../back/utils/jwt')

router.get('/',userController,(req,res)=>{
    if (req.headers.cookie != undefined){
        res.redirect('/')
    }else{
    res.render('index.html',result);
    }
});

router.get('/main_category',(req,res)=>{
    res.render('main_category.html');
});
router.get('/sub_category',(req,res)=>{
    res.render('sub_category.html');
});
router.get('/board_view',(req,res)=>{
    res.render('board_view.html');
});
router.get('#join_frm',(req,res)=>{
    res.render('index.html');
});
