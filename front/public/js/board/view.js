const b_idx = location.href.split('=')[1]

document.addEventListener('DOMContentLoaded', async ()=> {
    const body = {
        b_idx,
    }

    const option = {
        withCredentials:true
    }

    const response = await axios.post('http://localhost:4000/board/view',body,option)

    const board = response.data.result.board
    const image = response.data.result.image
    const hashtag = response.data.result.hashtag
    const likes = response.data.result.likes
    const dislikes = response.data.result.dislikes

    document.getElementById('view_subject').innerHTML = board[0].subject
    document.getElementById('view_content').innerHTML = board[0].content
    document.getElementById('view_hit').innerHTML = board[0].hit
    document.getElementById('view_userid').innerHTML = board[0].userid
    document.getElementById('view_date').innerHTML = board[0].date
    document.getElementById('view_subcategory').innerHTML = board[0].s_name
    document.getElementById('view_hashtag').innerHTML = hashtag[0].name
    document.getElementById('likes').innerHTML = likes.length
    document.getElementById('dislikes').innerHTML = dislikes.length
})

// like
const like_btn = document.querySelector('#like_btn')

like_btn.addEventListener('click',async (e)=>{
    e.preventDefault()
    
    const body = { 
        b_idx,
    }

    const option={
        withCredentials:true,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/likes',body,option)
        if (response.data.like_check == 0)
        alert('좋아요!!')
        window.location.reload()
        if (response.data.like_check == 1)
        alert('좋아요 취소..')
        window.location.reload()
    }catch (e){
        console.log(e.message);
    }
})

const dislike_btn =document.querySelector('#dislike_btn')

dislike_btn.addEventListener('click',async ()=>{

    const body = { 
        b_idx,
    }

    const option={
        withCredentials:true,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/dislikes',body,option)
        if (response.data.like_check == 0)
        alert('싫어요..')
        window.location.reload()
        if (response.data.like_check == 1)
        alert('싫어요 취소!!')
        window.location.reload()
    }catch (e){
        console.log(e.message);
    }
})

const board_delete = document.querySelector('#board_delete')
const userid = document.querySelector('#userid')

board_delete.addEventListener('click',async ()=>{
    const body = {
        b_idx,
    }

    const option={
        withCredentials:true,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/delete',body,option)

        if (response.data.errno == 0)
        alert('게시글 삭제가 완료되었습니다.')
        location.href="localhost:4000/board/category"
    }catch (e){
        console.log(e.message)
    }
})

const board_down =document.querySelector('#board_down')

board_down.addEventListener('click',async ()=>{

    const body = { 
        b_idx,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/down',body)
        if (response.data.errno == 0)
        alert('숨김 처리 되었습니다.')
        location.href="localhost:4000/board/category"
    }catch (e){
        console.log(e.message);
    }
})

const board_edit_btn = document.querySelector('#board_edit')
const board_edit_hidden = document.querySelector('#board_edit_hidden')

board_edit_btn.addEventListener('click', async () => {
    const body ={
        b_idx,
    }

    const option={
        withCredentials:true,
    }

    const response = await axios.post('http://localhost:4000/board/getEdit',body,option)

    console.log(response.data);
})