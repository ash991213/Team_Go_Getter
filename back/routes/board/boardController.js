const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.GetWrite = async (req,res) => {
    const sql = `SELECT * FROM maincategory`
    const sql2 = `SELECT * FROM subcategory`

    let response = {
        errno:0
    }

    try {
        const [maincategory] = await pool.execute(sql)
        const [subcategory] = await pool.execute(sql2)

        const result = { maincategory,subcategory }

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

exports.PostWrite = async (req,res) => {
    const { subject,content,subcategory } = req.body

    let token = req.cookies.user

    const userid = decodePayload(token).userid

    const files = req.files
    const filename = new Array()
    if ( req.files.upload1 != undefined ) {filename.push(req.files.upload1[0].filename)}
    if ( req.files.upload2 != undefined ) {filename.push(req.files.upload2[0].filename)}
    if ( req.files.upload3 != undefined ) {filename.push(req.files.upload3[0].filename)}
    if ( req.files.upload4 != undefined ) {filename.push(req.files.upload4[0].filename)}
    if ( req.files.upload5 != undefined ) {filename.push(req.files.upload5[0].filename)}

    const { hashtag } = req.body

    const [[result]] = await pool.execute(`SELECT s_idx FROM subcategory WHERE s_name='${subcategory}'`)
    const s_idx = result.s_idx 
    
    const sql = `INSERT INTO board(userid,subject,content,date,s_idx) VALUES (?,?,?,CURRENT_TIMESTAMP,?)`
    const prepare = [userid,subject,content,s_idx]

    let response = {
        errno:0
    }

    try{
        const [result2] = await pool.execute(sql,prepare)
        const b_idx = result2.insertId

        if ( filename != [] )
        filename.forEach( async v => {
            const sql2 = `INSERT INTO file(image,b_idx) VALUES ('${v}',${b_idx})`
            await pool.execute(sql2)
        });

        if ( hashtag != [] )
        hashtag.forEach( async v => {
            const sql3 = `SELECT * FROM hashtag WHERE name='${v}'`
            const [result3] = await pool.execute(sql3)
            if ( result3.length == 0 ){
                const sql4 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                await pool.execute(sql4)

                const [result3] = await pool.execute(sql3)
                const h_idx = result3[0].h_idx

                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
            } else {
                const h_idx = result3[0].h_idx
                
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
            }
        });

        await pool.execute(`UPDATE point SET b_point = b_point+10 WHERE userid = '${userid}'`)

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

exports.list = async (req,res) => {
    const { user:token } = req.body
    const userid = decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/') AS image,
                 GROUP_CONCAT(DISTINCT d.name separator'/') AS hashtag
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 GROUP BY a.b_idx
                 ORDER BY a.userid = 'admin' DESC, a.b_idx ASC;
                 `
    
    const sql2 = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, a.reply_count, e.s_name, f.m_name,
                  GROUP_CONCAT(DISTINCT b.image separator'/') AS image,
                  GROUP_CONCAT(DISTINCT d.name separator'/') AS hashtag
                  FROM board AS a 
                  JOIN file AS b ON a.b_idx = b.b_idx
                  JOIN board_hash AS c ON a.b_idx = c.b_idx
                  JOIN hashtag AS d ON c.h_idx = d.h_idx
                  JOIN subcategory AS e ON a.s_idx = e.s_idx
                  JOIN maincategory AS f ON e.m_idx = f.m_idx
                  WHERE a.isActive = 1
                  GROUP BY a.b_idx
                  ORDER BY a.userid = 'admin' DESC, a.b_idx ASC;
                  `

    let response = {
        errno:0
    }

    try {
        if ( userid == 'admin' ) {
            const [result] = await pool.execute(sql)
            console.log(result);
            response = {
                ...response,
                result
            }
        } else {
            const [result2] = await pool.execute(sql2)
            console.log(result2);
            response = {
                ...response,
                result2
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
    const { m_idx } = req.body

    
    const { user:token } = req.body
    const userid = decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/') AS image,
                 GROUP_CONCAT(DISTINCT d.name separator'/') AS hashtag
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE f.m_idx = ${m_idx} 
                 GROUP BY a.b_idx
                 ORDER BY a.userid = 'admin' DESC, a.b_idx ASC;
                 `

    const sql2 = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, a.reply_count, e.s_name, f.m_name,
                  GROUP_CONCAT(DISTINCT b.image separator'/') AS image,
                  GROUP_CONCAT(DISTINCT d.name separator'/') AS hashtag
                  FROM board AS a 
                  JOIN file AS b ON a.b_idx = b.b_idx
                  JOIN board_hash AS c ON a.b_idx = c.b_idx
                  JOIN hashtag AS d ON c.h_idx = d.h_idx
                  JOIN subcategory AS e ON a.s_idx = e.s_idx
                  JOIN maincategory AS f ON e.m_idx = f.m_idx
                  WHERE f.m_idx = ${m_idx} AND a.isActive = 1
                  GROUP BY a.b_idx
                  ORDER BY a.userid = 'admin' DESC, a.b_idx ASC;
                  `
    
    let response = {
        errno:0
    }

    try {
        if ( userid == 'admin' ) {
            const [result] = await pool.execute(sql)
            response = {
                ...response,
                result
            }
        } else {
            const [result2] = await pool.execute(sql2)
            response = {
                ...response,
                result2
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

exports.subList = async (req,res) => {
    const { s_idx } = req.body

    const { user:token } = req.body
    const userid = decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/') AS image,
                 GROUP_CONCAT(DISTINCT d.name separator'/') AS hashtag
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE a.s_idx = ${s_idx}
                 GROUP BY a.b_idx
                 ORDER BY a.userid = 'admin' DESC, a.b_idx ASC;
                 `

    const sql2 = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, a.reply_count, e.s_name, f.m_name,
                  GROUP_CONCAT(DISTINCT b.image separator'/') AS image,
                  GROUP_CONCAT(DISTINCT d.name separator'/') AS hashtag
                  FROM board AS a 
                  JOIN file AS b ON a.b_idx = b.b_idx
                  JOIN board_hash AS c ON a.b_idx = c.b_idx
                  JOIN hashtag AS d ON c.h_idx = d.h_idx
                  JOIN subcategory AS e ON a.s_idx = e.s_idx
                  JOIN maincategory AS f ON e.m_idx = f.m_idx
                  WHERE a.s_idx = ${s_idx} AND a.isActive = 1
                  GROUP BY a.b_idx
                  ORDER BY a.userid = 'admin' DESC, a.b_idx ASC;
                  `

    let response = {
        errno:0
    }
    try {
        if ( userid == 'admin' ) {
            const [result] = await pool.execute(sql) 
            response = {
                ...response,
                result
            }
        } else {
            const [result2] = await pool.execute(sql2)
            response = {
                ...response,
                result2
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

    const sql = `SELECT a.b_idx, a.subject, a.content, DATE_FORMAT(a.date,'%Y-%m-%d') as date, a.hit, b.username, b.gender, b.email, c.s_name
                 FROM board a
                 LEFT JOIN user AS b ON a.userid = b.userid
                 LEFT JOIN subcategory AS c ON a.s_idx = c.s_idx
                 WHERE a.b_idx = ${b_idx}
                 `

    const sql2 = `SELECT image FROM file WHERE b_idx = ${b_idx}`

    const sql3 = `SELECT GROUP_CONCAT(DISTINCT a.name separator',') AS name 
                  FROM hashtag a
                  LEFT OUTER JOIN board_hash AS b
                  ON a.h_idx = b.h_idx
                  WHERE b.b_idx = ${b_idx}`

    const sql4 = `SELECT * FROM likes WHERE b_idx = ${b_idx} AND like_num = 1;`

    const sql5 = `SELECT * FROM likes WHERE b_idx = ${b_idx} AND dislike_num = 1;`

    let cookies = req.cookies.visit

    let response = {
        errno:0
    }

    const date = new Date()
    const day = new Date(date.setDate(date.getDate()+1))
    const time = day.setHours(0,0,0,0)

    try {
        if ( cookies != undefined ) {
            let newCookie = cookies.split('/')

            if ( newCookie.includes(b_idx) == false ) {
            await pool.execute(`UPDATE board SET hit = hit+1 WHERE b_idx = ${b_idx}`)
                cookies = cookies + '/' + b_idx
                res.cookie('visit',cookies, {
                    expires: new Date(time)
                })
            }

        } else {
            await pool.execute(`UPDATE board SET hit = hit+1 WHERE b_idx = ${b_idx}`)
            res.cookie('visit',b_idx, {
                expires: new Date(time)
            })
        }

        const [board] = await pool.execute(sql)
        const [image] = await pool.execute(sql2)
        const [hashtag] = await pool.execute(sql3)
        const[likes] = await pool.execute(sql4)
        const[dislikes] = await pool.execute(sql5)

        const result = {board,image,hashtag,likes,dislikes}

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
    const { b_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.username, b.gender, b.email
                 FROM board a
                 LEFT OUTER JOIN user AS b ON a.userid = b.userid
                 WHERE a.b_idx = ${b_idx}
                 `

    const sql2 = `SELECT image FROM file WHERE b_idx = ${b_idx}`

    const sql3 = `SELECT a.name FROM hashtag a
                  LEFT OUTER JOIN board_hash AS b
                  ON a.h_idx = b.h_idx
                  WHERE b_idx = ${b_idx}`

    const sql4 = `SELECT * FROM board WHERE b_idx = ${b_idx} AND userid = '${userid}'`

    const [result4] = await pool.execute(sql4)

    let response = {
        errno:0
    }

    try {
        if ( result4.length == 0 && userid != 'admin' ) throw new Error ('본인의 글만 수정할 수 있습니다.')
        
        const [board] = await pool.execute(sql)
        const [image] = await pool.execute(sql2)
        const [hashtag] = await pool.execute(sql3)

        const result = { board,image,hashtag }

        response = {
            ...response,
            result
        }
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1,
        }
    }
    res.json(response)
};

exports.PostEdit = async (req,res) => {
    const { subject,content } = req.body
    const b_idx = req.query

    const files = req.files
    const filename = new Array()
    if ( req.files.upload1 != undefined ) {filename.push(req.files.upload1[0].filename)}
    if ( req.files.upload2 != undefined ) {filename.push(req.files.upload2[0].filename)}
    if ( req.files.upload3 != undefined ) {filename.push(req.files.upload3[0].filename)}
    if ( req.files.upload4 != undefined ) {filename.push(req.files.upload4[0].filename)}
    if ( req.files.upload5 != undefined ) {filename.push(req.files.upload5[0].filename)}

    const { hashtag } = req.body

    const sql = `UPDATE board SET content='${content}',subject='${subject}' WHERE b_idx=${b_idx}`

    const sql2 = `DELETE FROM file WHERE b_idx=${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)

        await pool.execute(sql2)

        files.forEach( async v => {
            const sql3 = `INSERT INTO file(image,b_idx) VALUES ('${v}',${b_idx})`
            await pool.execute(sql3)
        });

        if ( hashtag.length == 0 ){
            const sql4=`DELETE a FROM board_hash AS a
                        LEFT OUTER JOIN hashtag AS b
                        ON a.h_idx = b.h_idx
                        WHERE a.b_idx = ${b_idx}`

            await pool.execute(sql4)
        }
        hashtag.forEach( async v => {
            const sql = `SELECT a.b_idx, b.h_idx, c.name
                             FROM board a
                             LEFT OUTER JOIN board_hash AS b ON a.b_idx = b.b_idx
                             LEFT OUTER JOIN hashtag AS c ON b.h_idx = c.h_idx
                             WHERE c.name = '${v}'
                             `
            const [result] = await pool.execute(sql)

            if ( result.length == 0 ) {
                const sql = `DELETE FROM board_hash WHERE b_idx = ${b_idx}`
                await pool.execute(sql)
                
                const sql2 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result2] = await pool.execute(sql2)

                if ( result2.length == 0 ){
                    const sql3 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql3)

                    const [result3] = await pool.execute(sql2)
                    const h_idx = result3[0].h_idx

                    const sql4 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                    await pool.execute(sql4)
                } else {
                const h_idx = result2[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
                }
            } else {
                const sql = `DELETE FROM board_hash WHERE b_idx = ${b_idx}`
                await pool.execute(sql)

                const sql2 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result2] = await pool.execute(sql2)

                if ( result2.length == 0 ){
                    const sql3 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql3)

                    const [result3] = await pool.execute(sql2)
                    const h_idx = result3[0].h_idx

                    const sql4 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                    await pool.execute(sql4)
                } else {
                const h_idx = result2[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
                }
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
    const { b_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `DELETE a,b,c
                 FROM board AS a
                 LEFT OUTER JOIN board_hash AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN file AS c ON a.b_idx = c.b_idx
                 WHERE a.b_idx = ${b_idx}
                 `

    const sql2 = `DELETE a
                  FROM hashtag AS a
                  LEFT OUTER JOIN board_hash AS b
                  ON a.h_idx = b.h_idx
                  WHERE b.h_idx IS NULL
                  `

    const sql3 = `SELECT * FROM board WHERE b_idx = ${b_idx} AND userid = '${userid}'`
    const [result3] = await pool.execute(sql3)

    let response = {
        errno:0
    }

    try {
        if ( result3.length == 0 && userid != 'admin' ) throw new Error ('본인의 글만 삭제할 수 있습니다.')
            await pool.execute('SET foreign_key_checks = 0')
            await pool.execute(sql)
            await pool.execute(sql2)
            await pool.execute('SET foreign_key_checks = 1')
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.likes = async (req,res) => {
    const { b_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `SELECT * FROM likes WHERE userid=? AND b_idx=?`

    const sql2 = `INSERT INTO likes (userid,b_idx,like_num,like_check)
                 VALUES (?,?,?,?)`

    const sql3 = `DELETE FROM likes WHERE userid=? AND b_idx=?`

    const prepare = [userid,b_idx]

    const prepare2 = [userid,b_idx,+1,1]

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
    const { b_idx } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `SELECT * FROM likes WHERE userid=? AND b_idx=?`

    const sql2 = `INSERT INTO likes (userid,b_idx,dislike_num,like_check)
                 VALUES (?,?,?,?)`

    const sql3 = `DELETE FROM likes WHERE userid=? AND b_idx=?`

    const prepare = [userid,b_idx]

    const prepare2 = [userid,b_idx,+1,1]

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

exports.down = async (req,res) => {
    const { b_idx } = req.body

    const sql = `SELECT * FROM board WHERE b_idx = ${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        if ( result[0].isActive == 1 ) {
            await pool.execute(`UPDATE board SET isActive = 2 WHERE b_idx = ${b_idx}`)
        } else {
            await pool.execute(`UPDATE board SET isActive = 1 WHERE b_idx = ${b_idx}`)
        }

    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.find = async (req,res) => {
    const {subject, content, hashtag} = req.body

    const prepare = new Array(`%${subject}%`,`%${content}%`,`%${hashtag}%`)

    const sql = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/'),
                 GROUP_CONCAT(DISTINCT d.name separator'/')
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE a.subject LIKE ? OR a.content LIKE ? OR d.name LIKE ? AND a.isActive = 1
                 GROUP BY a.b_idx
                 `
    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare)
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