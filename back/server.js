const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./models/db.js').pool;
const webSocket = require('ws');
const app = express();

const router = require('./routes/index.js');

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({
    origin:true,
    credentials:true,
}));

app.use(router);

app.listen(4000);