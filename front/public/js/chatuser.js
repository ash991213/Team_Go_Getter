const axios = require('axios')

exports.chatUser = async (req,res,next) => {
    const option = {
        withCredentials: true 
    }

    const response = await axios.post('http://localhost:4000/chat/user',option)

    console.log(response)

    req.user = {
        ...user
    }
}