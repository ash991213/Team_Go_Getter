const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./models/db.js').pool;
const app = express();
const router = require('./routes/index.js');

const SocketIO = require('socket.io')
const socket = require('./socket.js')

const http = require('http');
const server = http.createServer(app);

const io = SocketIO(server, {
    cors: {
        origin:true,
        credentials:true,
    }
});
socket(io)

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors({
    origin:true,
    credentials:true,
}));

app.use(router);

server.listen(4000);