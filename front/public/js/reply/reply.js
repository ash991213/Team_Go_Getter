const main_reply_btn = document.querySelector('#main_reply_btn')
const main_reply_input = document.querySelector('#main_reply_input')

main_reply_btn.addEventListener('click',async ()=>{

    const body = {
        b_idx,
        content:main_reply_input.value
    }

    const option = {
        withCredentials:true
    }

    const response = await axios.post('http://localhost:4000/reply/mainwrite',body,option)

    if(response.data.errno == 0 )
    alert('댓글 작성이 완료 되었습니다.')
    window.location.reload()
})

const main_delete_btns = document.querySelectorAll('#main_delete_btn')
const r_idx = document.querySelectorAll('#r_idx')
const groupNum = document.querySelectorAll('#groupNum')
const depth = document.querySelectorAll('#depth')

main_delete_btns.forEach((v,i)=>{
    v.addEventListener('click',async ()=>{

        const body = {
            b_idx,
            r_idx:r_idx[i].value,
            groupNum:groupNum[i].value,
            depth:depth[i].value,
        }
    
        const option = {
            withCredentials:true
        }
    
        const response = await axios.post('http://localhost:4000/reply/delete',body,option)
    
        if(response.data.errno == 0)
        alert('댓글 삭제가 완료되었습니다.')
        window.location.reload()
    })
})

const reply_like_btns = document.querySelectorAll('#reply_like_btn')

reply_like_btns.forEach( (v,i)=>{
    v.addEventListener('click', async ()=>{
        const body = { 
            r_idx:r_idx[i].value,
        }

        console.log(body)

        const option={
            withCredentials:true,
        }

        try{
            const response = await axios.post('http://localhost:4000/reply/likes',body,option)
            if (response.data.like_check == 0)
            alert('좋아요..')
            window.location.reload()
            if (response.data.like_check == 1)
            alert('좋아요 취소!!')
            window.location.reload()
        }catch (e){
            console.log(e.message);
        }
    })
})

const reply_dislike_btns = document.querySelectorAll('#reply_dislike_btn')

reply_dislike_btns.forEach( (v,i)=>{
    v.addEventListener('click', async ()=>{
        const body = { 
            r_idx:r_idx[i].value,
        }

        const option={
            withCredentials:true,
        }

        try{
            const response = await axios.post('http://localhost:4000/reply/dislikes',body,option)
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
})