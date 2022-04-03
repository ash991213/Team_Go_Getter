const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.GetWrite = async (req,res) => {
    // 서브 카테고리
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

    // const token = req.cookies.user
    const userid = 'ash991213' // decodePayload(token).userid

    const files = req.files
    const filename = new Array()
    if ( req.files.upload1 != undefined ) {filename.push(req.files.upload1[0].filename)}
    if ( req.files.upload2 != undefined ) {filename.push(req.files.upload2[0].filename)}
    if ( req.files.upload3 != undefined ) {filename.push(req.files.upload3[0].filename)}
    if ( req.files.upload4 != undefined ) {filename.push(req.files.upload4[0].filename)}
    if ( req.files.upload5 != undefined ) {filename.push(req.files.upload5[0].filename)}

    const hashtag = req.body

    // 서브 카테고리 idx값 가져오기
    const [[result]] = `SELECT * FROM subcategory WHERE name = ${subcategory}`
    const s_idx = result.s_idx 
    
    // 게시글 추가
    const sql = `INSERT INTO board(userid,subject,content,date,s_idx) VALUES (?,?,?,CURRENT_TIMESTAMP,?)`
    const prepare = [userid,subject,content,s_idx]

    let response = {
        errno:0
    }

    try{
        const [result2] = await pool.execute(sql,prepare)
        const b_idx = result2.insertId

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
            // 없으면 해시태그 테이블에 추가 후 게시판_해시 테이블에 추가
            if ( result3.length == 0 ){
                const sql4 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                await pool.execute(sql4)
                const [result3] = await pool.execute(sql3)
                const h_idx = result3[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
            } else {
            // 있으면 게시판_해시 테이블에만 추가
                const h_idx = result3[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
            }
        });

        // 게시글 작성시 point 추가
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

    // 전체 게시글
    const sql = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/'),
                 GROUP_CONCAT(DISTINCT d.name separator'/')
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 GROUP BY a.b_idx
                 ORDER BY userid = 'admin' DESC, b_idx ASC;
                 `

    // 글보기 가능한 게시글
    const sql2 = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                  GROUP_CONCAT(DISTINCT b.image separator'/'),
                  GROUP_CONCAT(DISTINCT d.name separator'/')
                  FROM board AS a 
                  JOIN file AS b ON a.b_idx = b.b_idx
                  JOIN board_hash AS c ON a.b_idx = c.b_idx
                  JOIN hashtag AS d ON c.h_idx = d.h_idx
                  JOIN subcategory AS e ON a.s_idx = e.s_idx
                  JOIN maincategory AS f ON e.m_idx = f.m_idx
                  WHERE a.isActive = 1
                  GROUP BY a.b_idx
                  ORDER BY userid = 'admin' DESC, b_idx ASC;
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

exports.mainList = async (req,res) => {
    const m_idx = 1 // req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    // 메인 카테고리의 모든 게시글
    const sql = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/'),
                 GROUP_CONCAT(DISTINCT d.name separator'/')
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE f.m_idx = ${m_idx} 
                 GROUP BY a.b_idx
                 ORDER BY userid = 'admin' DESC, b_idx ASC;
                 `

    // 메인 카테고리의 글보기 가능한 게시글
    const sql2 = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                  GROUP_CONCAT(DISTINCT b.image separator'/'),
                  GROUP_CONCAT(DISTINCT d.name separator'/')
                  FROM board AS a 
                  JOIN file AS b ON a.b_idx = b.b_idx
                  JOIN board_hash AS c ON a.b_idx = c.b_idx
                  JOIN hashtag AS d ON c.h_idx = d.h_idx
                  JOIN subcategory AS e ON a.s_idx = e.s_idx
                  JOIN maincategory AS f ON e.m_idx = f.m_idx
                  WHERE f.m_idx = ${m_idx} AND a.isActive = 1
                  GROUP BY a.b_idx
                  ORDER BY userid = 'admin' DESC, b_idx ASC;
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
    const s_idx = 1 //req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    // 서브 카테고리의 모든 게시글
    const sql = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                 GROUP_CONCAT(DISTINCT b.image separator'/'),
                 GROUP_CONCAT(DISTINCT d.name separator'/')
                 FROM board AS a 
                 JOIN file AS b ON a.b_idx = b.b_idx
                 JOIN board_hash AS c ON a.b_idx = c.b_idx
                 JOIN hashtag AS d ON c.h_idx = d.h_idx
                 JOIN subcategory AS e ON a.s_idx = e.s_idx
                 JOIN maincategory AS f ON e.m_idx = f.m_idx
                 WHERE a.s_idx = ${s_idx}
                 GROUP BY a.b_idx
                 ORDER BY userid = 'admin' DESC, b_idx ASC;
                 `

    // 서브 카테고리의 글보기 가능한 게시글
    const sql2 = `SELECT a.b_idx, a.subject, a.content, a.date, a.hit, a.reply_count, e.s_name, f.m_name,
                  GROUP_CONCAT(DISTINCT b.image separator'/'),
                  GROUP_CONCAT(DISTINCT d.name separator'/')
                  FROM board AS a 
                  JOIN file AS b ON a.b_idx = b.b_idx
                  JOIN board_hash AS c ON a.b_idx = c.b_idx
                  JOIN hashtag AS d ON c.h_idx = d.h_idx
                  JOIN subcategory AS e ON a.s_idx = e.s_idx
                  JOIN maincategory AS f ON e.m_idx = f.m_idx
                  WHERE a.s_idx = ${s_idx} AND a.isActive = 1
                  GROUP BY a.b_idx
                  ORDER BY userid = 'admin' DESC, b_idx ASC;
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
    const b_idx = 3 // req.query

    // 게시글 내용
    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.username, b.gender, b.email
                 FROM board a
                 LEFT OUTER JOIN user AS b ON a.userid = b.userid
                 WHERE a.b_idx = ${b_idx}
                 `

    // 이미지 파일
    const sql2 = `SELECT image FROM file WHERE b_idx = ${b_idx}`

    // 해시태그
    const sql3 = `SELECT a.name FROM hashtag a
                  LEFT OUTER JOIN board_hash AS b
                  ON a.h_idx = b.h_idx
                  WHERE b_idx = ${b_idx}`

    let cookies = req.cookies.visit

    let response = {
        errno:0
    }

    // 쿠키 만료기간 설정
    const date = new Date()
    const day = new Date(date.setDate(date.getDate()+1))
    const time = day.setHours(0,0,0,0)

    try {
        if ( cookies != undefined ) {
            let newCookie = cookies.split('/')

            function findNum(n) { if(parseInt(n) === b_idx) return true }

            if ( newCookie.findIndex(findNum) == -1 ) {
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

        const result = {board,image,hashtag}

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
    const b_idx = 3 // req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    // 게시글 내용
    const sql = `SELECT a.b_idx, a.userid, a.subject, a.content, a.date, a.hit, b.username, b.gender, b.email
                 FROM board a
                 LEFT OUTER JOIN user AS b ON a.userid = b.userid
                 WHERE a.b_idx = ${b_idx}
                 `

    // 이미지 파일
    const sql2 = `SELECT image FROM file WHERE b_idx = ${b_idx}`

    // 해시태그
    const sql3 = `SELECT a.name FROM hashtag a
                  LEFT OUTER JOIN board_hash AS b
                  ON a.h_idx = b.h_idx
                  WHERE b_idx = ${b_idx}`

    // 본인인증
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

        const result = { board, image, hashtag }

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

    const files = req.files
    const filename = new Array()
    if ( req.files.upload1 != undefined ) {filename.push(req.files.upload1[0].filename)}
    if ( req.files.upload2 != undefined ) {filename.push(req.files.upload2[0].filename)}
    if ( req.files.upload3 != undefined ) {filename.push(req.files.upload3[0].filename)}
    if ( req.files.upload4 != undefined ) {filename.push(req.files.upload4[0].filename)}
    if ( req.files.upload5 != undefined ) {filename.push(req.files.upload5[0].filename)}

    const hashtag = ['테스트1','테스트2','테스트3','테스트4','테스트5'] // req.body

    // 게시글 수정
    const sql = `UPDATE board SET content='${content}',subject='${subject}' WHERE b_idx=${b_idx}`

    // 이미지 파일 삭제
    const sql2 = `DELETE FROM file WHERE b_idx=${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)

        await pool.execute(sql2)

        files.forEach( async v => {
            // 이미지 파일 다시 추가
            const sql3 = `INSERT INTO file(image,b_idx) VALUES ('${v}',${b_idx})`
            await pool.execute(sql3)
        });

        // 해시태그가 없으면 모두 삭제
        if ( hashtag.length == 0 ){
            const sql4=`DELETE a FROM board_hash AS a
                        LEFT OUTER JOIN hashtag AS b
                        ON a.h_idx = b.h_idx
                        WHERE a.b_idx = ${b_idx}`

            await pool.execute(sql4)
        }
        hashtag.forEach( async v => {
            // 해시태그가 다른 게시글에 사용중인지 체크
            const sql = `SELECT a.b_idx, b.h_idx, c.name
                             FROM board a
                             LEFT OUTER JOIN board_hash AS b ON a.b_idx = b.b_idx
                             LEFT OUTER JOIN hashtag AS c ON b.h_idx = c.h_idx
                             WHERE c.name = '${v}'
                             `
            const [result] = await pool.execute(sql)

            if ( result.length == 0 ) {
                // 사용중이지 않을경우 삭제
                const sql = `DELETE FROM board_hash WHERE b_idx = ${b_idx}`
                await pool.execute(sql)
                // 입력한 해시태그가 이미 있는지 체크
                const sql2 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result2] = await pool.execute(sql2)

                // 없으면 해시태그 테이블에 추가후 게시판_해시 테이블에 추가
                if ( result2.length == 0 ){
                    const sql3 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql3)
                    const [result3] = await pool.execute(sql2)
                    const h_idx = result3[0].h_idx
                    const sql4 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                    await pool.execute(sql4)
                } else {
                // 업으면 게시판_해시 테이블에만 추가
                const h_idx = result2[0].h_idx
                const sql5 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                await pool.execute(sql5)
                }
            } else {
                const sql = `DELETE FROM board_hash WHERE b_idx = ${b_idx}`
                await pool.execute(sql)
                const sql2 = `SELECT * FROM hashtag WHERE name='${v}'`
                const [result2] = await pool.execute(sql2)

                // 없으면 해시태그 테이블에 추가
                if ( result2.length == 0 ){
                    const sql3 = `INSERT INTO hashtag(name) VALUES ('${v}')`
                    await pool.execute(sql3)
                    const [result3] = await pool.execute(sql2)
                    const h_idx = result3[0].h_idx
                    const sql4 = `INSERT INTO board_hash(h_idx,b_idx) VALUES (${h_idx},${b_idx})`
                    await pool.execute(sql4)
                } else {
                // 게시판_해시 테이블에 추가
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
    const b_idx = 1 //req.query

    // const token = req.cookies.user
    const userid = 'admin' // decodePayload(token).userid

    // 게시글 , 게시글_해시 , 이미지 파일 삭제
    const sql = `DELETE a,b,c
                 FROM board AS a
                 LEFT OUTER JOIN board_hash AS b ON a.b_idx = b.b_idx
                 LEFT OUTER JOIN file AS c ON a.b_idx = c.b_idx
                 WHERE a.b_idx = ${b_idx}
                 `

    // 해시태그 삭제
    const sql2 = `DELETE a
                  FROM hashtag AS a
                  LEFT OUTER JOIN board_hash AS b
                  ON a.h_idx = b.h_idx
                  WHERE b.h_idx IS NULL
                  `

    // 본인인증
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
    const b_idx = 1 // req.body

    // const token = req.cookies.user
    const userid = 'ash991213' // decodePayload(token).userid

    // 해당 게시글에 좋아요를 눌렀나 체크
    const sql = `SELECT * FROM likes WHERE userid=? AND b_idx=?`

    // 안눌렀으면 좋아요 등록
    const sql2 = `INSERT INTO likes (userid,b_idx,like_num,like_check)
                 VALUES (?,?,?,?)`

    // 이미 눌렀으면 좋아요 취소
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

    // 해당 게시글의 싫어요를 눌렀나 체크
    const sql = `SELECT * FROM likes WHERE userid=? AND b_idx=?`

    // 안눌렀을경우 싫어요 등록
    const sql2 = `INSERT INTO likes (userid,b_idx,dislike_num,like_check)
                 VALUES (?,?,?,?)`

    // 이미 눌렀을경우 싫어요 취소
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

    // 해당 게시글 찾아오기
    const sql = `SELECT * FROM board WHERE b_idx = ${b_idx}`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        if ( result[0].isActive == 1 ) {
            // 게시글 보이기 상태일경우 숨기기
            await pool.execute(`UPDATE board SET isActive = 2 WHERE b_idx = ${b_idx}`)
        } else {
            // 게시글 숨기기 상태일경우 보이기
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