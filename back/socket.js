const pool = require('./models/db.js').pool;
const moment = require('moment');

module.exports = title = (io) => {
    const chat = io.of('/chat')

    chat.on('connection', (socket) => {
        socket.on('title', (req) => {
            const cr_idx = req
            socket.join(cr_idx);

            socket.on ('disconnection', ()=>{
                socket.leave(cr_idx)
        })

            socket.on('chat', async (data) => {
                const [userid,content]  = ["test1","test1"]

                try {
                    const sql = `INSERT INTO chat (userid,cr_idx,content,date)
                                VALUES (?,?,?,CURRENT_TIMESTAMP)` 

                    const prepare = [userid,cr_idx,content]
                    const [result] = await pool.execute(sql,prepare)
                    console.log(result)

                    chat.to(cr_idx).emit('chatting', {
                        msg: content,
                        time:moment(new Date()).format('h:mm A')
                    })

                } catch(error) {
                    console.log(error.message)
                }
            })
        })
    })
}

// io.on('connection', (socket) => {
//     console.log('서버 웹소켓 connect')

//     socket.on('chatting',(data)=>{
//         console.log(data)
//         const { name, msg } = data;
//         io.emit('chatting', {
//             name,
//             msg,
//             time:moment(new Date()).format('h:mm A')
//         })
//     })
// })