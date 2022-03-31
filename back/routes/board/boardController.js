const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.GetWrite = async (req,res) => {
    const sql = 'SELECT * FROM subcategory'

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

exports.PostWrite = async (req,res) => {
    const { subject,content,subcategory } = req.body

    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const files = new Array()
    if ( req.files.upload1 != undefined ) {filename.push(req.files.upload1[0].filename)}
    if ( req.files.upload2 != undefined ) {filename.push(req.files.upload2[0].filename)}
    if ( req.files.upload3 != undefined ) {filename.push(req.files.upload3[0].filename)}
    if ( req.files.upload4 != undefined ) {filename.push(req.files.upload4[0].filename)}
    if ( req.files.upload5 != undefined ) {filename.push(req.files.upload5[0].filename)}

    const hashtag = req.body
    
    const sql = `INSERT INTO board(userid,subject,content,date,subcategory) VALUES (?,?,?,CURRENT_TIMESTAMP,?)`
    const prepare = [userid,subject,content,subcategory]

    let response = {
        errno:0
    }

    try{
        const [result] = await pool.execute(sql,prepare)
        const b_idx = result.insertId

        // 이미지 파일이 있으면 추가
        if ( files != [] )
        files.forEach( async v => {
            const sql2 = `INSERT INTO file(image,b_idx) VALUES ('${v}',${b_idx})`
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
                const [result3] = await pool.execute(sql3)
                const h_idx = result3[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
            } else {
            // 게시판_해시 테이블에 추가
                const h_idx = result3[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
            }
        });

        // 게시글 작성 point 추가
        const [[result4]] = await pool.execute(`SELECT * FROM point WHERE userid = ${userid}`)
        const b_point = result4.b_point + 10
        await pool.execute(`UPDATE point SET b_point = ${b_point} WHERE userid = ${userid}`)

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
    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    const sql = 'SELECT * FROM board'

    const sql2 = 'SELECT * FROM board WHERE isActive = 1'

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

exports.mainList = async (req,res) => {
    const m_idx = 1 // req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.date, a.hit, a.s_idx, a.reply_count b.image, d.name, e.s_name, f.m_name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 LEFT OUTER JOIN subcategory AS e ON a.s_idx = e.s_idx
                 LEFT OUTER JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE f.m_idx = ${m_idx}`

    const sql2 = `SELECT a.b_idx, a.userid, a.subject, a.date, a.hit, a.s_idx, a.reply_count, b.image, d.name, e.s_name, f.m_name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 LEFT OUTER JOIN subcategory AS e ON a.s_idx = e.s_idx
                 LEFT OUTER JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE f.m_idx = ${m_idx} AND isActive = 1`
    
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
    const s_idx = 1 //req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.date, a.hit, a.s_idx, a.reply_count, b.image, d.name, e.s_name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 LEFT OUTER JOIN subcategory AS e ON a.s_idx = e.s_idx
                 WHERE a.s_idx = ${s_idx}`

    const sql2 = `SELECT a.b_idx, a.userid, a.subject, a.date, a.hit, a.s_idx, a.reply_count, b.image, d.name, e.s_name
                  FROM board a
                  LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                  LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                  LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                  LEFT OUTER JOIN subcategory AS e ON a.s_idx = e.s_idx
                  WHERE a.s_idx = ${s_idx} AND a.isActive = 1`

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
            console.log(result2)
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
    const b_idx = 1 // req.query

    let cookies = req.cookies.visit

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.image, d.name, e.username, e.gender, e.email
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 LEFT OUTER JOIN user AS e ON a.userid = e.userid
                 WHERE a.b_idx = ${b_idx}
                 `

    const date = new Date()
    const day = new Date(date.setDate(date.getDate()+1))
    const time = day.setHours(0,0,0,0)

    let response = {
        errno:0
    }

    const [[result]] = await pool.execute(`SELECT * FROM board WHERE b_idx = ${b_idx}`)
    const hit = result.hit + 1

    try {
        if ( cookies != undefined ) {
            let newCookie = cookies.split('/')

            function findNum(n) { if(parseInt(n) === b_idx) return true }

            if ( newCookie.findIndex(findNum) == -1 ) {
            await pool.execute(`UPDATE board SET hit = ${hit} WHERE b_idx = ${b_idx}`)
                cookies = cookies + '/' + b_idx
                res.cookie('visit',cookies, {
                    expires: new Date(time)
                })
            }
        } else {
            await pool.execute(`UPDATE board SET hit = ${hit} WHERE b_idx = ${b_idx}`)
            res.cookie('visit',b_idx, {
                expires: new Date(time)
            })
        }

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

exports.GetEdit = async (req,res) => {
    const b_idx = 1 // req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.image, d.name
                 FROM board a
                 LEFT OUTER JOIN file AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN board_hash AS c ON a.b_idx = c.b_idx
                 LEFT OUTER JOIN hashtag AS d ON c.h_idx = d.h_idx
                 WHERE a.b_idx = ${b_idx}
                 `

    const sql2 = `SELECT * FROM teamGoGetter.board WHERE b_idx = 1 AND userid = '${userid}'`
    const [result2] = await pool.execute(sql2)

    let response = {
        errno:0
    }

    try {
        if ( result2.length == 0 && userid != 'admin' ) throw new Error ('본인의 글만 수정할 수 있습니다.')
        const [result] = await pool.execute(sql)
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
    const b_idx = 1 // req.query

    const files = ['수정이미지1','수정이미지2','수정이미지3','수정이미지4','수정이미지5'] // req.files

    const hashtag = ['테스트1','테스트2','테스트3','테스트4','테스트5'] // req.body // 해시태그 배열에 담아서 주세요.

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
            const sql3 = `INSERT INTO file(image,b_idx) VALUES ('${v}',${b_idx})`
            await pool.execute(sql3)
        });

        // 해시태그
        if ( hashtag.length == 0 ){
            console.log('삭제')
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
            console.log(result)

            if ( result.length == 0 ) { // 사용중인 것인지 아닌지 확인하여 신규 / 수정 체크
                console.log('신규')
                const sql = `DELETE FROM board_hash WHERE b_idx = ${b_idx}`
                await pool.execute(sql)
                // 입력한 해시태그가 이미 있는지 체크
                const sql3 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result3] = await pool.execute(sql3)
                // 없으면 해시태그 테이블에 추가

                if ( result3.length == 0 ){
                    const sql4 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql4)
                    const [result3] = await pool.execute(sql3)
                    const h_idx = result3[0].h_idx
                    const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                    await pool.execute(sql5)
                } else {
                // 게시판_해시 테이블에 추가
                const h_idx = result3[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
                }
            } else {
                console.log('수정')
                const sql = `DELETE FROM board_hash WHERE b_idx = ${b_idx}`
                await pool.execute(sql)
                const sql3 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result3] = await pool.execute(sql3)
                // 없으면 해시태그 테이블에 추가

                if ( result3.length == 0 ){
                    const sql4 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql4)
                    const [result3] = await pool.execute(sql3)
                    const h_idx = result3[0].h_idx
                    const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                    await pool.execute(sql5)
                } else {
                // 게시판_해시 테이블에 추가
                const h_idx = result3[0].h_idx
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
    const b_idx = 1 //req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

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

    const sql3 = `SELECT * FROM teamGoGetter.board WHERE b_idx = 1 AND userid = '${userid}'`
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
    const b_idx = 1 // req.body

    // const token = req.cookies.user
    const userid = 'ash991213' // decodePayload(token).userid

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
    const b_idx = 1 // req.body

    // const token = req.cookies.user
    const userid = 'ash991213' // decodePayload(token).userid

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

exports.down = async (rep,res) => {
    const b_idx = 1 // req.body

    const sql = `SELECT * FROM board WHERE b_idx = ${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        console.log(result)
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