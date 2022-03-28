require('dotenv').config();
const { application, response } = require("express");
const { pool } = require('../../models/db');
const cookieParser = require('cookie-parser')
const { makeToken } = require('../../utils/jwt.js');

const secretKey = process.env.SECRET_KEY; // salt
const algorithm = process.env.JWT_ALG; // 사용 알고리즘
const expiresIn = process.env.JWT_EXP; // 만료기간
const issuer = process.env.JWT_ISSUER; // 토큰 발급자


//회원가입
exports.joinpostMid  = async (req,res)=>{
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

    let response = {
        errno:0
    }

    try {
        const [result] = await pool.execute(sql,prepare);
        if ( intro != '' ) {
            const [result2] = await pool.execute(sql2);
        }
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
exports.idcheckpostMid = async (req,res) =>{
        const {userid} = req.body;
        console.log(userid);

        try {
            const sql = `SELECT * FROM user WHERE userid = '${userid}'`
            const [result] = await pool.execute(sql);
            console.log(result);
            console.log(result.length);
        try {
            if (result.length === 0) throw new Error ('중복된 아이디입니다.');
            res.send('1');
        } catch (error) {
            res.send('2');
        };
    } catch (error){
        console.log(error);
    };
};


exports.loginpostMid = async (req,res) => {
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
// exp
