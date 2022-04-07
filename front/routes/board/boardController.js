const axios = require('axios');

exports.list = async (req,res)=>{
    const response = await axios.get('http://localhost:4000/board/write')

    const subcategory = response.data.result

    res.render('board_list.html',{subcategory});
}

exports.category = (req,res)=>{
    res.render('category.html');
}

exports.view = (req,res) => {
    res.render('board_view.html')
}