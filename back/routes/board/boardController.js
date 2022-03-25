const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.write = async (req,res) => {
    const { subject,content } = req.body
    const token = req.headers.cookie
    const userid = decodePayload(token).userid

    const files = req.files

    const hashtag = req.body
    
    const sql = `INSERT INTO board(userid,subject,content,date) VALUES (?,?,?,CURRENT_TIMESTAMP)`
    const prepare = [userid,subject,content]

    let response = {
        errno:0
    }

    try{
        const [result] = await pool.execute(sql,prepare)
        const b_idx = result.insertId

        // 이미지 파일이 있으면 추가
        if ( files != [] )
        files.forEach( async v => {
            const sql2 = `INSERT INTO file(image,b_idx) VALUES ('${v.filename}',${b_idx})`
            await pool.execute(sql2)
        });

        // 해시태그 있으면 추가
        if ( hashtag != [] )
        hashtag.forEach( async v => {
            // 입력한 해시태그가 이미 있는지 체크
            const sql3 = `SELECT * FROM hashtag WHERE name='${v}'`
            const [result3] = await pool.execute(sql3)
            // 없으면 해시태그 테이블에 추가
            if ( result3.length == 0 ){
                const sql4 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                await pool.execute(sql4)
            }
            // 게시판_해시 테이블에 추가
            const h_idx = result5[0].h_idx
            const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
            await pool.execute(sql5)
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

exports.mainList = async (req,res) => {
    const m_idx = 1 // req.query

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.date, a.hit, a.s_idx, b.image, d.name, e.s_name, f.m_name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 LEFT OUTER JOIN subcategory AS e ON a.s_idx = e.s_idx
                 LEFT OUTER JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE f.m_idx = ${m_idx}`
    
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
}

exports.subList = async (req,res) => {
    const s_idx = 1 //req.query

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.date, a.hit, a.s_idx, b.image, d.name, e.name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 LEFT OUTER JOIN subcategory AS e ON a.s_idx = e.s_idx
                 WHERE a.s_idx = ${s_idx}`

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
}

exports.view = async (req,res) => {
    const b_idx = 2 // req.query

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.image, d.name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 WHERE a.b_idx = ${b_idx}
                 `

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        console.log(result)
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
}

exports.GetEdit = async (req,res) => {
    const b_idx = 1 // req.query

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.image, d.name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 WHERE a.b_idx = ${b_idx}
                 `

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

    const files = req.files

    const hashtag = req.body // 해시태그 배열에 담아서 주세요.

    const sql = `UPDATE board SET content='${content}',subject='${subject}' WHERE b_idx=${b_idx}`

    const sql2 = `DELETE FROM file WHERE b_idx=${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)

        // 이미지파일 전부 지우고 다시 추가
        await pool.execute(sql2)

        files.forEach( async v => {
            const sql3 = `INSERT INTO file(image,b_idx) VALUES ('${v.filename}',${b_idx})`
            await pool.execute(sql3)
        });
        
        // 해시태그 
        hashtag.forEach( async v => {
            // 입력된 해시태그가 없으면 모든 해시태그 지우기
            if ( v == '' ){
                const sql4=`DELETE FROM board_hash WHERE b_idx=${b_idx}`
                await pool.execute(sql4)
            } else {
                // 입력한 해시태그가 이미 있는지 체크
                const sql5 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result5] = await pool.execute(sql5)
                // 없으면 해시태그 테이블에 추가
                if ( result5.length == 0 ){
                    const sql6 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql6)
                }
                // 게시판_해시 테이블에 추가
                const h_idx = result5[0].h_idx
                const sql7 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql7)
            }
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
};

exports.delete = async (req,res) => {
    const b_idx = 1 //req.query

    const sql = `DELETE a,b,c
                 FROM board AS a
                 INNER JOIN board_hash AS b
                 INNER JOIN file AS c
                 ON a.b_idx = b.b_idx = c.b_idx
                 WHERE a.b_idx = ${b_idx}`

    // 해시태그 테이블에 사용되지않고있는 해시태그 체크하고 삭제해야함
    // ON DELETE CASCADE ??

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}