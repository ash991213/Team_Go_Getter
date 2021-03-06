const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.mainwrite = async (req,res) => {
    const { content,b_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

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

        const [[result4]] = await pool.execute(`SELECT * FROM point WHERE userid = '${userid}'`)
        const r_point = result4.r_point + 10
        await pool.execute(`UPDATE point SET r_point = ${r_point} WHERE userid = '${userid}'`)

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

exports.subwrite = async (req,res) => {
    const { content,groupNum } = req.body
    
    const b_idx = req.query

    const token = req.cookies.user
    const userid = decodePayload(token).userid

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

        await pool.execute(`UPDATE point SET r_point = r_point+10 WHERE userid = '${userid}'`)
    
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
    const { b_idx } = req.body

    const sql = `SELECT a.userid, a.r_idx, a.depth, a.content, a.groupNum, DATE_FORMAT(a.date,'%Y-%m-%d') as date, b.username, b.gender, b.email 
                 FROM reply a
                 JOIN user AS b ON a.userid = b.userid
                 WHERE depth = 1 AND b_idx = ${b_idx}
                 `
    const sql2 = `SELECT a.userid, a.r_idx, a.depth, a.content, a.groupNum, a.seq, DATE_FORMAT(a.date,'%Y-%m-%d') as date, b.username, b.gender, b.email 
                  FROM reply a
                  JOIN user AS b ON a.userid = b.userid
                  WHERE depth = 2 AND b_idx = ${b_idx}
                  `

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

    const token = req.cookies.user
    const userid = decodePayload(token).userid
     
    const sql = `UPDATE reply SET content = '${content}' WHERE r_idx = '${r_idx}'`

    const sql2 = `SELECT * FROM reply WHERE r_idx = ${r_idx} AND userid = '${userid}'`
    const [result2] = await pool.execute(sql2)

    let response = {
        errno:0
    }

    try{
        if ( result2.length == 0 && userid != 'admin' ) throw new Error ('????????? ????????? ????????? ??? ????????????.')
        await pool.execute(sql)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:0
        }
    }
    res.json(response)
}

exports.delete = async (req,res) => {
    const { r_idx,groupNum,depth } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `DELETE FROM reply WHERE groupNum = ${groupNum}`
    const sql2 = `DELETE FROM reply WHERE r_idx = ${r_idx}`

    const sql3 = `SELECT * FROM reply WHERE r_idx = ${r_idx} AND userid = '${userid}'`
    const [result3] = await pool.execute(sql3)

    let response = {
        errno:0
    }

    try {
        if ( result3.length == 0 && userid != 'admin' ) throw new Error ('????????? ????????? ????????? ??? ????????????.')
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
    const { r_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

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
    res.json(response)
}

exports.dislikes = async (req,res) => {
    const { r_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

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
    res.json(response)
}