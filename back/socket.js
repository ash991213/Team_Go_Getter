const pool = require('./models/db.js').pool;
const moment = require('moment');
const { decodePayload } = require('./utils/jwt.js');

module.exports = title = (io) => {
    const chat = io.of('/chat')

    chat.on('connection', (socket) => {
        socket.on('title', async (req) => {
            const cr_idx = req
            const token = socket.handshake.headers.cookie.split('=')[1]
            const user = decodePayload(token)
            socket.join(cr_idx);

            const sql = `SELECT * FROM chatroom WHERE cr_idx = ${cr_idx}`
            try {
                const [[result]] = await pool.execute(sql)
                const title = result.title

                chat.to(cr_idx).emit('title',{title,})
            } catch (error) {
                console.log(error.message)
            }
            
            socket.on ('disconnection', ()=>{
                socket.leave(cr_idx)
            })

            socket.on('chat', async (data) => {
                const userid  = user.userid
                const content = data.msg

                try {
                    const sql2 = `INSERT INTO chat (userid,cr_idx,content,date)
                                VALUES (?,?,?,CURRENT_TIMESTAMP)` 

                    const prepare = [userid,cr_idx,content]

                    await pool.execute(sql2,prepare)

                    chat.to(cr_idx).emit('chatting', {
                        userid,
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