require('dotenv').config();
const pool = require('../../models/db.js').pool;
const { makeToken } = require('../../utils/jwt.js');
const { decodePayload } = require('../../utils/jwt.js');

exports.login = async (req,res) => {
    const { userid,userpw } =req.body

    const sql = `SELECT * FROM user WHERE userid = ? AND userpw = ?`
    const prepare = [userid,userpw]

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare)
        const payload = {
            userid : result[0].userid,
            username : result[0].username,
            nickname : result[0].nickname
        }

        if ( result.length != 0 ) {
            if ( result[0].level == 1 ) {
                const token = makeToken(payload)
                res.cookie('user',token)
            } else {
                response = {
                    errno:3
                }
            }
        } else {
            response = {
                errno:2
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

exports.logout = async (req,res) => {

    let response = {
        errno:0
    }

    try {
        res.clearCookie('admin')
    } catch(error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.categoryList = async (req,res) => {
    const sql = `SELECT * FROM maincategory`
    const sql2 = `SELECT * FROM subcategory`

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
    console.log(response)
    res.json(response)
}

exports.mainCategory = async (req,res) => {
    const { m_name } = req.body

    const sql = `INSERT INTO maincategory(m_name)
                 VALUES ('${m_name}')`

    let response = {
        errno:0
    }

    try {
        await pool.execute(sql)

    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.subCategory = async (req,res) => {
    const { s_name,m_idx } = req.body

    const sql = `INSERT INTO subcategory(s_name,m_idx)
                 VALUES ('${s_name}',${m_idx})`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql)
        console.log(result)

    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.mainDelete = async (req,res) => {
    const { m_name } = req.body

    const sql = `DELETE FROM maincategory WHERE m_name = '${m_name}'`

    let response = {
        errno:0
    }

    try {
        await pool.execute(sql)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.subDelete = async (req,res) => {
    const { s_name } = req.body

    const sql = `DELETE FROM subcategory WHERE s_name = '${s_name}'`

    let response = {
        errno:0
    }

    try {
        await pool.execute(sql)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.getUserEdit = async (req,res) => {
    const { userid } = req.body

    const sql = `SELECT * FROM user a
                 JOIN intro AS b ON a.userid = b.userid
                 JOIN point AS c ON a.userid = c.userid
                 WHERE a.userid = userid`

    const sql2 = `SELECT * FROM board WHERE userid = '${userid}'`

    const sql3 = `SELECT * FROM reply WHERE userid = '${userid}'`
    
    const sql4 = `SELECT * FROM likes a
                  JOIN board as b ON a.b_idx = b.b_idx
                  WHERE a.userid = '${userid}' AND a.like_num = 1`
    
    const sql5 = `SELECT * FROM likes a
                  JOIN reply as b ON a.r_idx = b.r_idx
                  WHERE a.userid = '${userid}' AND a.like_num = 1`

    let response = {
        errno:0
    }

    try {
        const [user] = await pool.execute(sql)
        const [board] = await pool.execute(sql2)
        const [reply] = await pool.execute(sql3)
        const [likes_board] = await pool.execute(sql4)
        const [likes_reply] = await pool.execute(sql5)

        const result = { user,board,reply,likes_board,likes_reply }
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

exports.postUserEdit = async (req,res) => {
    const { userid,userpw,username,nickname,adress,date,mobile,tel,email,intro,isActive,level } = req.body

    const sql = `UPDATE user SET userpw = ?, username = ?, nickname = ?, adress = ?, date = ?, mobile = ?, tel = ?, email = ?,
                 isActive = ?, level = ? WHERE userid = ${userid}`

    const prepare = [userpw,username,nickname,adress,date,mobile,tel,email,isActive,level]

    const sql2 = `UPDATE intro SET content = '${intro}' WHERE userid = '${userid}'`

    let response = {
        errno:0
    }

    try {
        await pool.execute(sql,prepare)
        await pool.execute(sql2)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}