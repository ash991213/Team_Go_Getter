const axios = require('axios');

exports.list = async (req,res)=>{
    const response = await axios.get('http://localhost:4000/board/write')

    const subcategory = response.data.result

    res.render('board_list.html',{subcategory});
}

exports.category = (req,res)=>{
    const response = await axios.get('http://localhost:4000/board/write')
    const maincategory = response.data.result.maincategory
    const subcategory = response.data.result.subcategory

    res.render('category.html',{maincategory,subcategory});
}

exports.view = (req,res) => {
    res.render('board_view.html')
}