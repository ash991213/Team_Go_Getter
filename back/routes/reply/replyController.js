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
        const [result3] = await pool.execute(`UPDATE reply SET groupNum=${groupNum} WHERE r_idx=${r_idx}`)

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