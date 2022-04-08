let b_idx = location.href.split('=')[1]

// like
const like_a =document.querySelector('#like_a')

like_a.addEventListener('click',async (e)=>{
    e.preventDefault()
    // const token = req.cookies.user
    
    const body = { 
        b_idx,
        // token,
    }
    const option={
        withCredentials:true,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/likes',body,option)
        if (response.data.errno == 0)
        alert('좋아요!!')
    }catch (e){
        console.log(e.message);
    }
})

// dislike

const dislike_a =document.querySelector('#dislike_a')

dislike_a.addEventListener('click',async ()=>{
    
    // const token = req.cookies.user

    const body = { 
        b_idx,
        // token,
    }
    const option={
        withCredentials:true,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/dislikes',body,option)
        if (response.data.errno == 0)
        alert('싫어요!!')
    }catch (e){
        console.log(e.message);
    }
})
// delete

const board_delete = document.querySelector('#board_delete')

board_delete.addEventListener('click',async ()=>{

    // const token = req.cookies.user

    const body = {
        b_idx,
        // token,
    }
    const option = {
        withCredentials:true,
    }
    try{
        const response = await axios.post('http://localhost:4000/board/delete',body,option)
        if (response.data.errno == 0)
        alert('게시글 삭제가 완료되었습니다.')
        location.href="localhost:4000/board/list"
    }catch (e){
        console.log(e.message)
    }
})

// down

const board_down =document.querySelector('#board_down')

board_down.addEventListener('click',async ()=>{
    // const token = req.cookies.user
    
    const body = { 
        b_idx,
        // token,
    }
    const option={
        withCredentials:true,
    }

    try{
        const response = await axios.post('http://localhost:4000/board/dislikes',body,option)
        if (response.data.errno == 0)
        alert('숨김 처리 되었습니다.')
    }catch (e){
        console.log(e.message);
    }
})

// const board_edit= document.querySelector('#board_edit')

// board_edit.addEventListener('click', async (e) => {
//     e.preventDefault()
//     const body ={
//         b_idx,
//     }
//     const option={
//         withCredentials:true,
//     }
//     const response = await axios.get('http://localhost:4000/board/edit',body,option)
//     console.log(response);
// })