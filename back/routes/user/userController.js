require('dotenv').config();
const { application, response } = require("express");
const { pool } = require('../../models/db');
const cookieParser = require('cookie-parser')
const { makeToken } = require('../../utils/jwt.js');
const { decodePayload } = require('../../utils/jwt.js');

const secretKey = process.env.SECRET_KEY; // salt
const algorithm = process.env.JWT_ALG; // 사용 알고리즘
const expiresIn = process.env.JWT_EXP; // 만료기간
const issuer = process.env.JWT_ISSUER; // 토큰 발급자


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

    const sql3 = `INSER INTO point (userid) VALUES ('${userid}')`

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
        const {userid} = req.body;
        console.log(userid);

        try {
            const sql = `SELECT * FROM user WHERE userid = '${userid}'`
            const [result] = await pool.execute(sql);
            console.log(result);
            console.log(result.length);
        try {
            if (result.length === 1) throw new Error ('중복된 아이디입니다.');
            res.send('1');
        } catch (error) {
            res.send('2');
        };
    } catch (error){
        console.log(error);
    };
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
                    // 로그인 성공
                    const token = makeToken(payload) // payload 에는 user정보가 들어가있어야 하죠?
                    console.log(token)
                    // jwt 토큰 생성은 완료했습니다.
                    res.cookie('user',token)
                    // cookie 보내주면 되겠죠? cookie parser
                } else {
                    // 관리자 페이지에서 로그인을 해주세요
                    console.log('관리자 아이입니다.')
                    response = {
                        errno:4
                    }
                }
            } else {
                // 사용정지된 아이디입니다
                console.log('아이디 정지')
                response = {
                    errno:3
                }
            }
        } else {
            // 존재하지 않는 아이디입니다.
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

    // 본인 프로필
    const sql = `SELECT * FROM user a
                 JOIN intro AS b ON a.userid = b.userid
                 JOIN point AS c ON a.userid = c.userid
                 WHERE a.userid = userid`
    // 본인이 쓴 글
    const sql2 = `SELECT * FROM board WHERE userid = '${userid}'`
    // 본인이 쓴 댓글
    const sql3 = `SELECT * FROM reply WHERE userid = '${userid}'`
    // 본인이 좋아요 누른 글
    const sql4 = `SELECT * FROM likes a
                  JOIN board as b ON a.b_idx = b.b_idx
                  WHERE a.userid = '${userid}' AND a.like_num = 1`
    // 본인이 좋아요 누른 댓글
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

exports.postEdit = async (req,res) => {
    const token = req.cookies.user
    const userid1 = decodePayload(token).userid

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

    const sql = `DELETE FROM user WHERE userid = ${userid}`

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
    const { userid,username } = req.body

    const sql = `SELECT * FROM user WHERE userid LIKE ? OR username LIKE ?`

    const prepare = [userid,username]

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

    // 본인 프로필
    const sql = `SELECT * FROM user a
                 JOIN intro AS b ON a.userid = b.userid
                 JOIN point AS c ON a.userid = c.userid
                 WHERE a.userid = userid`
    // 본인이 쓴 글
    const sql2 = `SELECT * FROM board WHERE userid = '${userid}'`
    // 본인이 쓴 댓글
    const sql3 = `SELECT * FROM reply WHERE userid = '${userid}'`
    // 본인이 좋아요 누른 글
    const sql4 = `SELECT * FROM likes a
                  JOIN board as b ON a.b_idx = b.b_idx
                  WHERE a.userid = '${userid}' AND a.like_num = 1`
    // 본인이 좋아요 누른 댓글
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