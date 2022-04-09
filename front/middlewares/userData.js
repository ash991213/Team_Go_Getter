const { decodePayload } = require('../uitl/jwt.js')
exports.userdata = (req, res, next) => {
    const token = req.cookies.user;
    try {
        if (token) {
            const { userid,username,nickname,level } = decodePayload(token)
            req.user = { userid,username,nickname,level, }

            next()
        } else {
            next()
        }
    } catch (err) {                 
        res.clearCookie('user')
        next()
    }
};