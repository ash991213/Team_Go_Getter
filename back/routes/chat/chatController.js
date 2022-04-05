const pool = require('../../models/db.js').pool;
const { decodePayload } = require('../../utils/jwt.js');

exports.user = async (req,res) => {
    
    const token = req.cookies.user
    const userid =  decodePayload(token).userid

    const sql = `SELECT * FROM user WHERE userid = '${userid}'`

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
        repsonse = {
            errno:1
        }
    }
    res.json(response)
}