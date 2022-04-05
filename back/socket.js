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
                const userid  = "test1"
                const content = data.msg

                try {
                    const sql = `INSERT INTO chat (userid,cr_idx,content,date)
                                VALUES (?,?,?,CURRENT_TIMESTAMP)` 

                    const prepare = [userid,cr_idx,content]

                    await pool.execute(sql,prepare)

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