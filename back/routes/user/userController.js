require('dotenv').config();
const { application, response } = require("express");
const { pool } = require('../../models/db');
const { makeToken } = require('../../utils/jwt.js');
const { decodePayload } = require('../../utils/jwt.js');

//회원가입
exports.joinpost  = async (req,res)=>{
    const { userid,userpw,username,nickname,birthdate,adress,gender,mobile,tel,email,intro } = req.body;
    const sql = `INSERT INTO user(
                    userid,
                    userpw,
                    username,
                    nickname,
                    birthdate,
                    adress,
                    gender,
                    mobile,
                    tel,
                    email
                ) values(
                    ?,?,?,?,?,?,?,?,?,?
                )`

    const prepare = [userid,userpw,username,nickname,birthdate,adress,gender,mobile,tel,email];

    const sql2 = `INSERT INTO intro(userid,content)
                  VALUES ('${userid}','${intro}')`

    const sql3 = `INSERT INTO point (userid) VALUES ('${userid}')`

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare);

        if ( intro != '' ) {
            await pool.execute(sql2);
        }

        await pool.execute(sql3)
        response = {
            ...response,
            result:{
                affectedRows:result.affectedRows,
                insertId:result.insertId
            }
        }
    } catch (e) {
        console.log(e.message)
        response = {
            errno:1
        }
    }
    res.json(response)
};


//중복체크
exports.idcheckpost = async (req,res) =>{
        const { userid } = req.body;

        let response = {
            errno:0
        }

        try {
            const sql = `SELECT * FROM user WHERE userid = '${userid}'`
            const [result] = await pool.execute(sql);
        try {
            if (result.length === 1) throw new Error ('중복된 아이디입니다.');
        } catch (error) {
            response = {
                errno:1
            }
        };
    } catch (error){
        console.log(error);
    };
    res.json(response)
};


exports.loginpost = async (req,res) => {
    const { userid,userpw } = req.body
    
    const sql = `SELECT * FROM user WHERE userid=? AND userpw=?`
    const prepare = [userid,userpw]

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare);
        const payload = {
            userid : result[0].userid,
            username : result[0].username,
            nickname : result[0].nickname
        }
        if (result.length !== 0) {
            if (result[0].isActive == 1) {
                if (result[0].level == 3) {
                    const token = makeToken(payload)
                    res.cookie('user',token)
                } else {
                    console.log('관리자 아이디입니다.')
                    response = {
                        errno:4
                    }
                }
            } else {
                console.log('아이디 정지')
                response = {
                    errno:3
                }
            }
        } else {
            console.log('아이디 존재하지 않음')
            response = {
                errno:2
            }
        }
    } catch (e){
        console.log(e.message)
        response = {
            errno:1
        }
    };
    res.json(response)
};

exports.getEdit = async (req,res) => {
    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `SELECT * FROM user a
                 JOIN intro AS b ON a.userid = b.userid
                 JOIN point AS c ON a.userid = c.userid
                 WHERE a.userid = '${userid}'`
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
        const [[user]] = await pool.execute(sql)
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

exports.postEdit = async (req,res) => {
    const { userid,userpw,username,nickname,adress,mobile,tel,email } = req.body

    const sql = `UPDATE user SET userpw = ?, username = ?, nickname = ?, adress = ?, mobile = ?, tel = ?, email = ? WHERE userid = '${userid}'`
    const sql2 = `UPDATE user SET userpw = ?, username = ?, nickname = ?, adress = ?, mobile = ?, email = ? WHERE userid = '${userid}'`

    const prepare = [userpw,username,nickname,adress,mobile,tel,email]
    const prepare2 = [userpw,username,nickname,adress,mobile,email]

    let response = {
        errno:0
    }

    try { 
        if ( tel != '')
        await pool.execute(sql,prepare)
        else
        await pool.execute(sql2,prepare2)
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
        res.clearCookie('user')
    } catch(error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.quit = async (req,res) => {
    const token = req.cookies.user
    const userid = decodePayload(token).userid

    const sql = `DELETE FROM user WHERE userid = '${userid}'`

    let response = {
        errno:0
    }

    try {
        await pool.execute(`SET foreign_key_checks = 0`)
        await pool.execute(sql)
        await pool.execute(`SET foreign_key_checks = 1`)
    } catch (error) {
        console.log(error.message)
        response = {
            errno:1
        }
    }
    res.json(response)
}

exports.list = async (req,res) => {
    const sql = `SELECT * FROM user`

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

exports.find = async (req,res) => {
    const { data } = req.body

    const sql = `SELECT * FROM user a 
                 JOIN intro AS b ON a.userid = b.userid
                 WHERE a.userid LIKE ? OR a.username LIKE ?`

    const prepare = new Array(`${data}`,`${data}`)

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

exports.data = async (req,res) => {
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

exports.point = async (req,res) => {
    const sql = `SELECT a.userid, b.b_point FROM user a
                 JOIN point AS b ON a.userid = b.userid
                 ORDER BY b.b_point DESC
                 LIMIT 10`

    const sql2 = `SELECT a.userid, b.r_point FROM user a
                  JOIN point AS b ON a.userid = b.userid
                  ORDER BY b.r_point DESC
                  LIMIT 10`

    let response = {
        errno:0
    }

    try {
        const [board] = await pool.execute(sql)
        const [reply] = await pool.execute(sql2)

        const result = { board,reply }
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