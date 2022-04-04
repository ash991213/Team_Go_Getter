const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const webSocket = require('ws');
const session = require('express-session')
const Memorystore = require('memorystore')(session)
const app = express();

const router = require('./routes/index.js');

app.set('view engine','html');
nunjucks.configure('views',{ express:app, watch:true });

app.use(express.static('public'));

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const maxAge = 6*600000
let sessionObj = {
    secret: "kim1",
    resave : false,
    saveUninitialized: true,
    store: new Memorystore({ checkPeriod: maxAge}),
    cookie:{
        maxAge:maxAge
    }
}

app.use(session(sessionObj))
app.use(router);

app.listen(3000);