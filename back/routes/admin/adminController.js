require('dotenv').config();
const pool = require('../../models/db.js').pool;
const { makeToken } = require('../../utils/jwt.js');
const { decodePayload } = require('../../utils/jwt.js');

const secretKey = process.env.SECRET_KEY; // salt
const algorithm = process.env.JWT_ALG; // 사용 알고리즘
const expiresIn = process.env.JWT_EXP; // 만료기간
const issuer = process.env.JWT_ISSUER; // 토큰 발급자

// 관리자 로그인
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
            if ( result[0].isActive == 3 ) {
                // 로그인 성공
                const token = makeToken(payload)
                res.cookie('admin',token)
            } else {
                // 관리자 아이디가 아닙니다.
                response = {
                    errno:3
                }
            }
        } else {
            // 존재하지 않는 아이디입니다.
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