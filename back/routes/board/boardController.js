const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.write = async (req,res) => {
    const { subject,content } = req.body
    const token = req.headers.cookie
    const userid = decodePayload(token).userid

    const files = req.files

    const [hash1,hash2,hash3,hash4,hash5] = req.body
    const hashtag = [hash1,hash2,hash3,hash4,hash5]
    
    const sql = `INSERT INTO board(userid,subject,content,date) VALUES (?,?,?,CURRENT_TIMESTAMP)`
    const prepare = [userid,subject,content]

    let response = {
        errno:0
    }

    try{
        const [result] = await pool.execute(sql,prepare)
        const b_idx = result.insertId

        
        if ( files )

        files.forEach( async v => {
            const sql2 = `INSERT INTO file(image,b_idx) VALUES ('${v.filename}',${b_idx})`
            const [result2] = await pool.execute(sql2)
        });

        if ( hashtag )

        hashtag.forEach( async v => {
            const sql3 = `INSERT INTO hashtag(name,b_idx) VALUES ('${v}',${b_idx})`
            const [result3] = await pool.execute(sql3)
        });

        response = {
            ...response,
            result:{
                affectedRows:result.affectedRows,
                insertId:result.insertId
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

exports.GetEdit = async (req,res) => {
    const b_idx = req.query

    const sql = `SELECT * FROM board WHERE b_idx=${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        response = {
            ...response,
            result
        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
};

exports.PostEdit = async (req,res) => {
    const { subject,content } = req.body
    const b_idx = req.query

    const sql = `UPDATE board SET content='${content}',subject='${subject}' WHERE b_idx=${b_idx}`
    
    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        response = {
            ...response,
            result
        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
};