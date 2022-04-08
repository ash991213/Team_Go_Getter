const axios = require('axios');

// 전체글
exports.list = async (req,res)=>{
    const user = req.cookies

    const option = {
        withCredentials:true,
    }
    const response1 = await axios.get('http://localhost:4000/board/write')

    const subcategory = response1.data.result.subcategory;
    console.log(subcategory);

    const response2 = await axios.post('http://localhost:4000/board/list',user,option)
    
    const allBoard = response2.data.result
    const board = response2.data.result2

    res.render('board_list.html', { allBoard,board,subcategory});
}

// 메인 카테고리 글 m_idx
exports.mainlist = async (req,res)=>{
    const { user } = req.cookies
    const { m_idx } = req.query

    const body = {
        user,
        m_idx,
    }
    const option = {
        withCredentials:true,
    }
    const response = await axios.post('http://localhost:4000/board/mainList',body,option)

    const allBoard = response.data.result
    const board = response.data.result2
    
    res.render('board_list.html' ,{ allBoard,board });
}

// 서브 카테고리 글 s_idx
exports.sublist = async (req,res)=>{
    const { user } = req.cookies
    const { s_idx } = req.query

    const body = {
        user,
        s_idx,
    }

    const option = {
        withCredentials:true,
    }

    const response = await axios.post('http://localhost:4000/board/subList',body,option)
    console.log(response);
    const allBoard = response.data.result
    const board = response.data.result2

    console.log(board)

    res.render('board_list.html', { allBoard,board });
}

exports.category = async (req,res)=>{
    const response = await axios.get('http://localhost:4000/board/write')

    const maincategory = response.data.result.maincategory
    const subcategory = response.data.result.subcategory
    
    res.render('category.html',{subcategory,maincategory});
}

exports.view = async (req,res) => {
    console.log(req.query)
    {b_idx=2}
    const  {b_idx} = req.query
    
    const response = await axios.get('http://localhost:4000/board/edit')
    console.log(response.data.result);
    res.render('board_view.html',{b_idx});
}