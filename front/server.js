const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const webSocket = require('ws');

const app = express();

const router = require('./routes/index.js');

app.set('view engine','html');
nunjucks.configure('views',{ express:app, watch:true });

app.use(express.static('public'));

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(router);

app.listen(3000);