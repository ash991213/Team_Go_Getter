const { decodePayload } = require('../uitl/jwt.js')
exports.userdata = (req, res, next) => {
    const token = req.cookies.user;
    try {
        if (token) {
            const { userid } = decodePayload(token)

            req.userid = { userid, }

            next()
        } else {
            next()
        }
    } catch (err) {
        res.clearCookie('user')
        next()
    }
};