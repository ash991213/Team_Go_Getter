const axios = require('axios');

// 전체글
exports.list = async (req,res)=>{
    const user = req.cookies

    const option = {
        withCredentials:true,
    }

    const response = await axios.post('http://localhost:4000/board/list',user,option)

    const allBoard = response.data.result
    const board = response.data.result2

    res.render('board_list.html', { allBoard,board });
}

<<<<<<< HEAD
exports.category = (req,res)=>{
    const response = await axios.get('http://localhost:4000/board/write')
    const maincategory = response.data.result.maincategory
    const subcategory = response.data.result.subcategory

    res.render('category.html',{maincategory,subcategory});
=======
// 메인 카테고리 글 m_idx
exports.mainlist = async (req,res)=>{
    const { user } = req.cookies

    const body = {
        user,
    }

    const option = {
        withCredentials:true,
    }

    const response = await axios.post('http://localhost:4000/board/list',body,option)

    const allBoard = response.data.result
    const board = response.data.result2

    res.render('board_list.html', { allBoard,board });
}

// 서브 카테고리 글 s_idx
exports.sublist = async (req,res)=>{
    const { user } = req.cookies

    const body = {
        user,
    }

    const option = {
        withCredentials:true,
    }

    const response = await axios.post('http://localhost:4000/board/list',body,option)

    const allBoard = response.data.result
    const board = response.data.result2

    res.render('board_list.html', { allBoard,board });
}

exports.category = async (req,res)=>{
    const response = await axios.get('http://localhost:4000/board/write')

    const maincategory = response.data.result.maincategory
    const subcategory = response.data.result.subcategory

    res.render('category.html',{subcategory,maincategory});
>>>>>>> d2ed3f3157f22206e4d043e0ed8b7e367b6f0744
}

exports.view = (req,res) => {
    res.render('board_view.html')
}