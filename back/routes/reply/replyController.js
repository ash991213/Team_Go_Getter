const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

// 댓글
exports.mainwrite = async (req,res) => {
    const { content } = req.body

    const b_idx = 5 //req.query

    // const token = req.headers.cookie
    const userid = 'ash991213' // decodePayload(token).userid

    const sql = `INSERT INTO 
                 reply(userid,b_idx,content,depth,seq,date) 
                 VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)`

    const prepare = [userid,b_idx,content,1,1]

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare)
        const [result2] = await pool.execute(`SELECT * FROM reply WHERE depth = 1`)

        const groupNum = result2[result2.length-2].groupNum+1
        const r_idx = result.insertId
        await pool.execute(`UPDATE reply SET groupNum=${groupNum} WHERE r_idx=${r_idx}`)

        const [[result3]] = await pool.execute(`SELECT * FROM board WHERE b_idx = ${b_idx}`)
        const reply_count = result3.reply_count + 1
        await pool.execute(`UPDATE board SET reply_count = ${reply_count} WHERE b_idx = ${b_idx}`)

        response = {
            ...response,
            result:{
                affectedRows:result.affectedRows,
                groupNum,
            }
        }

    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
};

// 대댓글
exports.subwrite = async (req,res) => {
    const { content,groupNum } = req.body
    
    const b_idx = 5 //req.query

    // const token = req.headers.cookie
    const userid = 'ash991213' // decodePayload(token).userid

    const sql = `INSERT INTO 
                 reply(userid,b_idx,content,depth,seq,date,groupNum) 
                 VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,?)`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(`SELECT * FROM reply WHERE groupNum = ${groupNum} AND depth = 2`)

        let seq = 1
        if ( result.length !== 0)
        seq=result[result.length-1].seq+1

        const prepare = [userid,b_idx,content,2,seq,groupNum]
        const [result2] = await pool.execute(sql,prepare)
    
        response = {
            ...response,
            result:{
                affectedRows:result2.affectedRows,
                insertId:result2.insertId
            }
        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.view = async (req,res) => {
    const b_idx = 5 // req.query

    const sql = `SELECT * FROM reply WHERE depth = 1`
    const sql2 = 'SELECT * FROM reply WHERE depth = 2'

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        const [result2] = await pool.execute(sql2)

        response = {
            ...response,
            result,
            result2
        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.edit = async (req,res) => {
    const { r_idx,content } = req.body

    const sql = `UPDATE reply SET content = '${content}' WHERE r_idx = '${r_idx}'`

    let response = {
        errno:0
    }

    try{
        await pool.execute(sql)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:0
        }
    }
}

exports.delete = async (req,res) => {
    const { r_idx,groupNum,depth } = req.body

    const sql = `DELETE FROM reply WHERE groupNum = ${groupNum}`
    const sql2 = `DELETE FROM reply WHERE r_idx = ${r_idx}`

    let response = {
        errno:0
    }

    try {
        if ( depth == 1 )
        await pool.execute(sql)
        else 
        await pool.execute(sql2)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.likes = async (req,res) => {
    const r_idx = 1 // req.body

    // const token = req.headers.cookie
    const userid = 'ash991213' // decodePayload(token).userid

    const sql = `SELECT * FROM likes WHERE userid=? AND r_idx=?`

    const sql2 = `INSERT INTO likes (userid,r_idx,like_num,like_check)
                 VALUES (?,?,?,?)`

    const sql3 = `DELETE FROM likes WHERE userid=? AND r_idx=?`

    const prepare = [userid,r_idx]

    const prepare2 = [userid,r_idx,+1,1]

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare)
        if ( result.length == 0 ) {
            await pool.execute(sql2,prepare2)

            response = {
                ...response,
                like_check:0
            }

        } else {
            if ( result[0].like_num == 1 ) {
                await pool.execute(sql3,prepare)
            } else {
                await pool.execute(sql3,prepare)
                await pool.execute(sql2,prepare2)
            }

            response = {
                ...response,
                like_check:1
            }

        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
}

exports.dislikes = async (req,res) => {
    const r_idx = 1 // req.body

    // const token = req.headers.cookie
    const userid = 'ash991213' // decodePayload(token).userid

    const sql = `SELECT * FROM likes WHERE userid=? AND r_idx=?`

    const sql2 = `INSERT INTO likes (userid,r_idx,dislike_num,like_check)
                 VALUES (?,?,?,?)`

    const sql3 = `DELETE FROM likes WHERE userid=? AND r_idx=?`

    const prepare = [userid,r_idx]

    const prepare2 = [userid,r_idx,+1,1]

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare)
        if ( result.length == 0 ) {
            await pool.execute(sql2,prepare2)

            response = {
                ...response,
                like_check:0
            }

        } else {
            if ( result[0].dislike_num == 1 ) {
                await pool.execute(sql3,prepare)
            } else {
                await pool.execute(sql3,prepare)
                await pool.execute(sql2,prepare2)
            }

            response = {
                ...response,
                like_check:1
            }

        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
}